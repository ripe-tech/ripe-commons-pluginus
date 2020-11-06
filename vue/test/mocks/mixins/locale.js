export const localeMockMixin = {
    computed: {
        locale() {
            return (value, defaultValue, locale = null, fallback = true) => value || defaultValue;
        }
    }
};
