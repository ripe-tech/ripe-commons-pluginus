import { RipeCommonsCapability, RipeCommonsPlugin } from "../abstract";
import configEnUs from "../../bundles/config.en_us";
import configJaJp from "../../bundles/config.ja_jp";
import configZhCn from "../../bundles/config.zh_cn";

export class FileLocaleLoaderPlugin extends RipeCommonsPlugin {
    /**
     * Loads the complete set of locale bundles from a file based data
     * sourcing structure.
     *
     * @returns {Array} The complete set of locales indexed as object
     * that contain both the contents and the locale type.
     */
    static getLocales() {
        return [
            {
                name: "config",
                locale: "en_us",
                content: configEnUs
            },
            {
                name: "config",
                locale: "ja_jp",
                content: configJaJp
            },
            {
                name: "config",
                locale: "zh_cn",
                content: configZhCn
            }
        ];
    }

    async load() {
        await super.load();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("locale-loader")];
    }

    async loadLocale() {
        const localeBundle = {};

        FileLocaleLoaderPlugin.getLocales().forEach(locale => {
            localeBundle[locale.locale] = locale ? locale.content : {};
        });

        return localeBundle;
    }
}

FileLocaleLoaderPlugin.register();
