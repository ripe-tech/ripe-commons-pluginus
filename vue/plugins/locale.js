export const localePlugin = {
    install(Vue, localePlugin) {
        Vue.filter("locale", function(value, defaultValue, locale, fallback = true) {
            if (!value) return defaultValue || "";
            value = value.toString();
            defaultValue = defaultValue !== undefined ? defaultValue : value;
            return localePlugin.toLocale(value, defaultValue, locale, fallback);
        });

        Object.defineProperty(Vue.prototype, "$locale", {
            value: localePlugin
        });
    }
};
