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
                    currentLocale: null
                }
            },
            mounted: function() {
                localePlugin.owner.bind("post_set_locale", locale => (this.currentLocale = locale));
                this.currentLocale = localePlugin.locale;
            },
            computed: {
                locale() {
                    return (value, defaultValue, locale = null, fallback = true) => {
                        return toLocale(value, defaultValue, locale || this.currentLocale, fallback);
                    };
                }
            }
        });

        Vue.filter("locale", function(value, defaultValue, locale, fallback = true) {
            console.warn("Using 'locale' as a filter has been deprecated, please use it as a function instead.");
            return toLocale(value, defaultValue, locale, fallback);
        });

        Object.defineProperty(Vue.prototype, "$locale", {
            value: localePlugin
        });
    }
};
