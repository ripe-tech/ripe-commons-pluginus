const utilsMixin = {
    methods: {
        capitalize(value) {
            if (!value) {
                return "";
            }

            return value[0].toUpperCase() + value.slice(1);
        },
        alert(options = {}) {
            this.$bus.trigger("alert", options);
        },
        async ask(options = {}) {
            const promise = new Promise((resolve, reject) => {
                options.callback = resolve;
                this.$bus.trigger("ask", options);
            });
            const { result } = await promise;
            return result;
        },
        async askError(options = {}) {
            options = typeof options === "string" ? { message: options } : options;
            options.title = options.title || "Error";
            options.message = options.message || options.error || "There was an error";
            options.buttonConfirm = options.buttonConfirm || "Confirm";
            options.buttonCancel = options.buttonCancel || null;
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
