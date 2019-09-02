import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

class DomLocaleLoaderPlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("locale-loader")];
    }

    async loadLocale(options) {
        options = options || {};
        return this._loadFromDOM(options.targetId);
    }

    _loadFromDOM(targetId) {
        targetId = targetId || "locale";
        let localeBundle = {};
        let localeE = document.getElementById(targetId);
        if (!localeE) {
            return null;
        }
        let locale = localeE.getAttribute("data-locale");
        let localeKeys = localeE ? JSON.parse(localeE.textContent) : {};
        localeBundle[locale] = localeKeys;
        return localeBundle;
    }
}

DomLocaleLoaderPlugin.register();

export { DomLocaleLoaderPlugin };
