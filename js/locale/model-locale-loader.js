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
            await this.loadModelLocale(brand, model, locale);
        }
    }

    async loadModelLocale(brand = null, model = null, locale = null) {
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
            localePlugin.setLocaleValue(key, result[key], currentLocale);
        }
    }

    async loadSdkBundle() {
        const ripeProvider = await this.owner.getPluginByCapability("ripe-provider");
        const localePlugin = await this.owner.getPluginByName("LocalePlugin");
        const currentLocale = localePlugin.getLocale();
        const sdkBundle = ripeProvider.ripe.getBundle()[currentLocale];

        for (const key in sdkBundle) {
            if (key === "_" && sdkBundle[key] === null) continue;
            localePlugin.setLocaleValue(key, sdkBundle[key], currentLocale);
        }
    }

    _bind() {
        this.owner.bind("config", async config => {
            if (!config) return;
            const { brand, name } = config;
            await this.loadModelLocales(brand, name);
        });

        this.owner.bind("bundles", async () => await this.loadSdkBundle());

        this.owner.bind("post_set_locale", async () => await this.loadModelLocales());
    }
}

ModelLocaleLoaderPlugin.register();
