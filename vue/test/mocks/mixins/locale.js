export const localeMockMixin = {
    computed: {
        localeReactive() {
            return (value, defaultValue) => value || defaultValue;
        }
    },
    methods: {
        locale(value, defaultValue) {
            return value || defaultValue;
        }
    }
};
