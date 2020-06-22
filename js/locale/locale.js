import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class LocalePlugin extends RipeCommonsPlugin {
    constructor(owner) {
        super(owner);
        this._bind();
    }

    async load() {
        await super.load();
        this.loaderPlugins = await this.owner.getPluginsByCapability("locale-loader"); // TODO better loader priority
        this.resolverPlugins = await this.owner.getPluginsByCapability("locale-resolver");
        this.localeMap = await this._loadLocales();
        this.locale = null;
        this.localeD = "en_us";
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

    getLocaleValue(key, defaultValue, locale, fallback = true) {
        locale = locale || this.locale;
        const localeKeys = this.localeMap[locale] || {};
        if (localeKeys[key] !== undefined) return localeKeys[key];
        if (fallback) return this.getLocaleValue(key, defaultValue, this.localeD, false);
        return defaultValue;
    }

    hasLocale(key, locale) {
        const keys = this.localeMap[locale] || {};
        return key in keys;
    }

    toLocale(key, defaultValue, locale, fallback = true) {
        return this.getLocaleValue(key, defaultValue, locale, fallback);
    }

    async setLocale(locale) {
        await this.owner.trigger("pre_set_locale", locale);
        this.locale = locale;
        await this.owner.trigger("post_set_locale", locale);
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
        this.owner.trigger("localeMap_updated");
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

    _bind() {
        this.owner.bind("locale_change", async locale => {
            await this.setLocale(locale);
        });
    }
}

LocalePlugin.register();
