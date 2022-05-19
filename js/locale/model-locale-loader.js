import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

/**
 * Class that contains the plugin implementation responsible for the
 * retrieval of locales for a certain model.
 *
 * Should attach itself to the proper event `ripe` and then "injects"
 * the associated locales in the locale plugin context.
 */
export class ModelLocaleLoaderPlugin extends RipeCommonsPlugin {
    constructor(owner) {
        super(owner);
        this._bind();
    }

    getVersion() {
        return "0.1.0";
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("locale-loader")];
    }

    async loadLocale() {
        return {};
    }

    async loadModelLocales(brand = null, model = null) {
        const localePlugin = await this.owner.getPluginByName("LocalePlugin");
        const locales = [localePlugin.getLocale(), localePlugin.getLocaleFallback()];
        for (const locale of new Set(locales)) {
            await this._loadModelLocale(brand, model, locale);
        }
    }

    /**
     * Loads the set of local bundles for the provided locale of the
     * default one (offered by locale plugin) so that the UI is able
     * to show the basic layout with the proper locale values.
     *
     * @param {String} locale The name of the locale to load the base bundles.
     */
    async loadBundleLocale(locale = null) {
        const ripeProviderPlugin = await this.owner.getPluginByCapability("ripe-provider");
        const localePlugin = await this.owner.getPluginByName("LocalePlugin");

        if (!ripeProviderPlugin) return;
        if (!localePlugin) return;

        const currentLocale = locale || localePlugin.getLocale();
        if (ripeProviderPlugin.ripe) {
            await ripeProviderPlugin.ripe._initBundles(currentLocale);
        } else {
            ripeProviderPlugin.bind("loaded", async () => {
                await ripeProviderPlugin.ripe._initBundles(currentLocale);
            });
        }
    }

    async loadRipeSdkLocales() {
        const ripeProvider = await this.owner.getPluginByCapability("ripe-provider");
        const localePlugin = await this.owner.getPluginByName("LocalePlugin");
        const locales = [localePlugin.getLocale(), localePlugin.getLocaleFallback()];

        for (const locale of new Set(locales)) {
            const bundle = ripeProvider.ripe.getBundle(locale);
            for (const [key, value] of Object.entries(bundle)) {
                if (key === "_" && value === null) continue;
                localePlugin.setLocaleValue(key, value, locale, { event: false });
            }
        }
        this.owner.trigger("locale_map_changed");
    }

    _bind() {
        this.owner.bind("config", async config => {
            if (!config) return;
            const { brand, name } = config;
            await this.loadModelLocales(brand, name);
        });

        this.owner.bind("pre_set_locale", async locale => await this.loadBundleLocale(locale));

        this.owner.bind("post_set_locale", async () => await this.loadModelLocales());

        this.owner.bind("bundles", async () => await this.loadRipeSdkLocales());
    }

    async _loadModelLocale(brand = null, model = null, locale = null) {
        const ripeProvider = await this.owner.getPluginByCapability("ripe-provider");
        const localePlugin = await this.owner.getPluginByName("LocalePlugin");
        const currentLocale = locale || localePlugin.getLocale();

        brand = brand || ripeProvider.ripe ? ripeProvider.ripe.brand : null;
        model = model || ripeProvider.ripe ? ripeProvider.ripe.model : null;
        if (!brand || !model) return;

        const result = await ripeProvider.ripe.getLocaleModelP({
            brand: brand,
            model: model,
            locale: currentLocale
        });

        for (const key in result) {
            if (key === "_" && result[key] === null) continue;
            localePlugin.setLocaleValue(key, result[key], currentLocale, { event: false });
        }
        this.owner.trigger("locale_map_changed");
    }
}

ModelLocaleLoaderPlugin.register();
