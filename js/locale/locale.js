import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class LocalePlugin extends RipeCommonsPlugin {
    constructor(owner) {
        super(owner);
        this._bind();
    }

    async load() {
        await super.load();
        this.loaderPlugins = await this.owner.getPluginsByCapability("locale-loader"); // TODO better loader priority
        this.storePlugin = await this.owner.getPluginByCapability("store-provider");
        this.resolverPlugins = await this.owner.getPluginsByCapability("locale-resolver");
        this.localeMap = await this._loadLocales();
        this.locale = null;
        this.localeD = "en_us";
    }

    async unload() {
        this.loaderPlugins = null;
        this.storePlugin = null;
        this.resolverPlugins = null;
        await super.unload();
    }

    getVersion() {
        return "0.1.0";
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }

    getLocale() {
        return this.locale;
    }

    getLocaleFallback() {
        const locales = this.getSupportedLocales();
        if (locales.includes(this.localeD)) return this.localeD;
        if (locales.length > 0) return locales[0];
        return null;
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

    async setLocale(locale, coerce = true) {
        if (coerce) locale = this._coerceLocale(locale);
        await this.owner.trigger("pre_set_locale", locale);
        this.locale = locale;
        await this.owner.trigger("post_set_locale", locale);
        this.owner.trigger("locale_changed", locale);
    }

    setLocaleValue(key, value, locale, options = { event: true }) {
        const localeKeys = this.localeMap[locale] || {};
        localeKeys[key] = value;
        this.localeMap[locale] = localeKeys;
        this.owner.trigger("locale", key, value, locale);
        if (options.event) this.owner.trigger("locale_map_changed");
    }

    unsetLocaleValue(key, locale, options = { event: true }) {
        const localeKeys = this.localeMap[locale] || {};
        delete localeKeys[key];
        if (options.event) this.owner.trigger("locale_map_changed");
    }

    setLocaleMap(localeMap, prefix = "") {
        prefix = prefix.length === 0 || prefix.endsWith(".") ? prefix : `${prefix}.`;
        for (const locale in localeMap) {
            const bundle = localeMap[locale];
            for (const key in bundle) {
                this.setLocaleValue(`${prefix}${key}`, bundle[key], locale, { event: false });
            }
        }
        this.owner.trigger("locale_map_changed");
    }

    unsetLocaleMap(localeMap, prefix = "") {
        prefix = prefix.length === 0 || prefix.endsWith(".") ? prefix : `${prefix}.`;
        for (const locale in localeMap) {
            const bundle = localeMap[locale];
            for (const key in bundle) {
                this.unsetLocaleValue(`${prefix}.${key}`, locale, { event: false });
            }
        }
        this.owner.trigger("locale_map_changed");
    }

    /**
     * Tries to update the locale in the locale store making
     * sure that the proper pre-conditions are met.
     *
     * If those pre-conditions are not met waits until the system
     * is ready and retries the operation.
     *
     * @param {String} locale The locale string to be set in the store.
     */
    _trySetStoreLocale(locale) {
        if (this.storePlugin.hasStore()) {
            this._setStoreLocale(locale);
        } else {
            // in case ripe provider store is not yet accessible
            // then wait for the loading of the plugin to make sure
            // that the store is available
            const postLoadBind = this.storePlugin.bind("loaded", () => {
                this.storePlugin.unbind("loaded", postLoadBind);
                this._setStoreLocale(locale);
            });
        }
    }

    /**
     * Set the given locale string value in the local store
     * so that proper reactive chains may be triggered.
     *
     * Makes sure that the proper pre-conditions are met so that
     * a "safe" locale set operation is possible.
     *
     * @param {String} locale The locale that is going to be set in
     * the Ripe's store.
     */
    _setStoreLocale(locale) {
        if (!this.storePlugin.hasStore()) return;
        if (this.storePlugin.getStore("locale") === locale) return;
        this.storePlugin.setStore("locale", locale);
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
        this.owner.bind("post_set_locale", async locale => {
            this._trySetStoreLocale(locale);
        });
    }

    _coerceLocale(locale) {
        for (const _locale of this.getSupportedLocales()) {
            if (!_locale.startsWith(locale)) continue;
            locale = _locale;
            break;
        }
        return locale;
    }
}

LocalePlugin.register();
