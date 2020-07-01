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
            localePlugin.setLocaleValue(key, result[key], currentLocale);
        }
    }

    _bind() {
        this.owner.bind("config", async config => {
            if (!config) return;
            const { brand, name } = config;
            await this.loadModelLocale(brand, name);
        });

        this.owner.bind("post_set_locale", async () => await this.loadModelLocale());
    }
}

ModelLocaleLoaderPlugin.register();
