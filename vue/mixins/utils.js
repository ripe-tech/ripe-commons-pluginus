const utilsMixin = {
    methods: {
        capitalize(value) {
            if (!value) {
                return "";
            }

            return value[0].toUpperCase() + value.slice(1);
        },
        normalize(value) {
            return value.split("_").join(" ");
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
        },
        dateString(timestamp, separator = "/") {
            const date = new Date(timestamp * 1000);
            const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            let month = date.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;
            return day + separator + month + separator + date.getFullYear();
        },
        dateStringUTC(timestamp, separator = "/") {
            const date = new Date(timestamp * 1000);
            const day = date.getUTCDate() < 10 ? `0${date.getUTCDate()}` : date.getUTCDate();
            let month = date.getUTCMonth() + 1;
            month = month < 10 ? `0${month}` : month;
            return day + separator + month + separator + date.getUTCFullYear();
        },
        timeString(timestamp, separator = ":") {
            const date = new Date(timestamp * 1000);
            const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
            return hours + separator + minutes + separator + seconds;
        },
        timeStringUTC(timestamp, separator = ":") {
            const date = new Date(timestamp * 1000);
            const hours = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours();
            const minutes =
                date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes();
            const seconds =
                date.getUTCSeconds() < 10 ? `0${date.getUTCSeconds()}` : date.getUTCSeconds();
            return hours + separator + minutes + separator + seconds;
        }
    }
};

export { utilsMixin };
