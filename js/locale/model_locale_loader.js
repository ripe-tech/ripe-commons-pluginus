import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

/**
 * Class that contains the plugin implentation responsible for the
 * retrieval of locales for a certain model.
 *
 * Should attach itself to the proper event `ripe` and then "injects"
 * the associated locales in the locale plugin context.
 */
class ModelLocaleLoaderPlugin extends RipeCommonsPlugin {
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

    _bind() {
        this.owner.bind("config", async config => {
            if (!config) {
                return;
            }
            const ripeProvider = await this.owner.getPluginByCapability("ripe-provider");
            const localePlugin = await this.owner.getPluginByName("LocalePlugin");
            const currentLocale = localePlugin.getLocale();
            const { brand, name } = config;
            const result = await ripeProvider.ripe.getLocaleModelP({
                brand: brand,
                model: name,
                locale: currentLocale
            });
            for (const key in result) {
                localePlugin.setLocaleValue(key, result[key], currentLocale);
            }
        });
    }
}

ModelLocaleLoaderPlugin.register();

export { ModelLocaleLoaderPlugin };
