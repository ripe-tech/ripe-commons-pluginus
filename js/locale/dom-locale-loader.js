import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class DomLocaleLoaderPlugin extends RipeCommonsPlugin {
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
        const localeBundle = {};
        const localeE = document.getElementById(targetId);
        if (!localeE) {
            return null;
        }
        const locale = localeE.getAttribute("data-locale");
        const localeKeys = localeE ? JSON.parse(localeE.textContent) : {};
        localeBundle[locale] = localeKeys;
        return localeBundle;
    }
}

DomLocaleLoaderPlugin.register();
