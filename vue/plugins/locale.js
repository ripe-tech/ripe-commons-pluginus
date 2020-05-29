export const localePlugin = {
    install(Vue, localePlugin) {
        Vue.filter("locale", function(value, defaultValue) {
            if (!value) {
                return defaultValue || "";
            }
            value = value.toString();
            defaultValue = defaultValue !== undefined ? defaultValue : value;
            return localePlugin.toLocale(value, defaultValue);
        });

        Object.defineProperty(Vue.prototype, "$locale", {
            value: localePlugin
        });
    }
};
