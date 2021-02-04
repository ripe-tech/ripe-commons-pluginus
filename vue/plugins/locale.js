export const localePlugin = {
    install(Vue, localePlugin) {
        const toLocale = function(value, defaultValue, locale, fallback = true) {
            if (!value) return defaultValue || "";
            value = value.toString();
            defaultValue = defaultValue !== undefined ? defaultValue : value;
            return localePlugin.toLocale(value, defaultValue, locale, fallback);
        };

        Vue.mixin({
            data: function() {
                return {
                    currentLocale: null,
                    localeMap: null
                };
            },
            computed: {
                locale() {
                    return (value, defaultValue, locale = null, fallback = true) => {
                        const fallbackValue = this.localeMap && this.localeMap[locale]
                            ? this.localeMap[locale][value]
                            : undefined;
                        return toLocale(
                            value,
                            defaultValue || fallbackValue,
                            locale || this.currentLocale,
                            fallback
                        );
                    };
                }
            },
            mounted: function() {
                localePlugin.owner.bind("post_set_locale", locale => (this.currentLocale = locale));
                localePlugin.owner.bind(
                    "locale_map_changed",
                    () => (this.localeMap = Object.assign({}, localePlugin.localeMap))
                );
                this.currentLocale = localePlugin.locale;
                this.localeMap = Object.assign({}, localePlugin.localeMap);
            }
        });

        Vue.filter("locale", function(value, defaultValue, locale, fallback = true) {
            console.warn(
                "Using 'locale' as a filter has been deprecated, please use it as a function instead."
            );
            return toLocale(value, defaultValue, locale, fallback);
        });

        Object.defineProperty(Vue.prototype, "$locale", {
            value: localePlugin
        });
    }
};
