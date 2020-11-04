export const localePlugin = {
    install(Vue, localePlugin) {
        const _locale = function(value, defaultValue, locale, fallback = true) {
            if (!value) return defaultValue || "";
            value = value.toString();
            defaultValue = defaultValue !== undefined ? defaultValue : value;
            return localePlugin.toLocale(value, defaultValue, locale, fallback);
        };

        Vue.mixin({
            computed: {
                localeReactive() {
                    return (value, defaultValue, locale, fallback = true) => {
                        return (
                            (this.$store && this.$store.state.locale || "unset") &&
                            this.$options.filters.locale(value, defaultValue, locale, fallback)
                        );
                    };
                }
            },
            methods: {
                locale(value, defaultValue, locale, fallback = true) {
                    return _locale(value, defaultValue, locale, fallback);
                }
            }
        });

        Vue.filter("locale", function(value, defaultValue, locale, fallback = true) {
            return _locale(value, defaultValue, locale, fallback);
        });

        Object.defineProperty(Vue.prototype, "$locale", {
            value: localePlugin
        });
    }
};
