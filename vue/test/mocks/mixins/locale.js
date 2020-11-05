export const localeMockMixin = {
    computed: {
        locale() {
            return (value, defaultValue) => value || defaultValue;
        }
    },
    methods: {
        locale(value, defaultValue) {
            return value || defaultValue;
        }
    }
};
