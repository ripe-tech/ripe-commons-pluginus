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
        async ask(options) {
            const promise = new Promise((resolve, reject) => {
                options.callback = resolve;
                this.$bus.trigger("ask", options);
            });
            const { result } = await promise;
            return result;
        },
        async askError(options) {
            options.title = options.title || "Error";
            options.message = options.message || "There was an error";
            options.confirmButton = options.confirmButton || "Confirm";
            options.cancelButton = options.cancelButton || null;
            const result = await this.ask(options);
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
