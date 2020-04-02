const utilsMixin = {
    methods: {
        capitalize(value) {
            if (!value) {
                return "";
            }

            return value[0].toUpperCase() + value.slice(1);
        },
        alert(options) {
            this.$bus.trigger("alert", options);
        },
        async ask(options = {}) {
            const promise = new Promise((resolve, reject) => {
                try {
                    this.$bus.$on("ask:confirm", () => resolve(true));
                    this.$bus.$on("ask:cancel", () => resolve(false));
                } catch (err) {
                    reject(err);
                }
            });
            this.$bus.trigger("ask", options);
            const result = await promise;
            return result;
        },
        readable(value) {
            return this.$options.filters.readable(value);
        },
        locale(value, defaultValue) {
            return this.$options.filters.locale(value, defaultValue);
        }
    }
};

export { utilsMixin };
