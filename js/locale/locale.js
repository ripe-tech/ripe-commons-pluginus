import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

class LocalePlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.loaderPlugins = await this.owner.getPluginsByCapability("locale-loader"); // TODO better loader priority
        this.resolverPlugins = await this.owner.getPluginsByCapability("locale-resolver");
        this.localeMap = await this._loadLocales();
        this.locale = null;
    }

    async unload() {
        this.loaderPlugins = null;
        this.resolverPlugins = null;
        await super.unload();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }

    getLocale() {
        return this.locale;
    }

    getSupportedLocales() {
        return Object.keys(this.localeMap);
    }

    getLocaleValue(key, defaultValue, locale) {
        locale = locale || this.locale;
        const localeKeys = this.localeMap[locale] || {};
        return localeKeys[key] || defaultValue;
    }

    hasLocale(key, locale) {
        const keys = this.localeMap[locale] || {};
        return key in keys;
    }

    toLocale(key, defaultValue, locale) {
        return this.getLocaleValue(key, defaultValue, locale);
    }

    setLocale(locale) {
        this.locale = locale;
        this.owner.trigger("locale_changed", locale);
    }

    setLocaleValue(key, value, locale) {
        const localeKeys = this.localeMap[locale] || {};
        localeKeys[key] = value;
        this.localeMap[locale] = localeKeys;
        this.owner.trigger("locale", key, value, locale);
    }

    setLocaleMap(localeMap, prefix = "") {
        prefix = prefix.length === 0 || prefix.endsWith(".") ? prefix : `${prefix}.`;
        for (const locale in localeMap) {
            const bundle = localeMap[locale];
            for (const key in bundle) {
                this.setLocaleValue(`${prefix}${key}`, bundle[key], locale);
            }
        }
    }

    unsetLocaleValue(key, locale) {
        const localeKeys = this.localeMap[locale] || {};
        delete localeKeys[key];
    }

    unsetLocaleMap(localeMap, prefix = "") {
        prefix = prefix.length === 0 || prefix.endsWith(".") ? prefix : `${prefix}.`;
        for (const locale in localeMap) {
            const bundle = localeMap[locale];
            for (const key in bundle) {
                this.unsetLocaleValue(`${prefix}.${key}`, locale);
            }
        }
    }

    async _loadLocales() {
        const locales = {};
        for (const plugin of this.loaderPlugins) {
            const localeBundle = await plugin.loadLocale();
            for (const locale in localeBundle) {
                const bundle = localeBundle[locale];
                locales[locale] = Object.assign({}, locales[locale], bundle);
            }
        }
        return locales;
    }
}

LocalePlugin.register();

export { LocalePlugin };
