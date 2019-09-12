const logicMixin = {
    inject: {
        manager: {
            default: null
        }
    },
    computed: {
        config() {
            return this.$store.state.config;
        },
        brand() {
            return this.$store.state.brand;
        },
        model() {
            return this.$store.state.model;
        },
        productId() {
            return this.$store.state.product_id;
        },
        variant() {
            return this.$store.state.variant;
        },
        flag() {
            return this.$store.state.flag;
        },
        description() {
            return this.$store.state.description || this.modelNormalized;
        },
        customerIdInput() {
            return this.$store.state.customerIdInput;
        },
        modelNormalized() {
            if (!this.model) return null;
            return this.model
                .split("_")
                .map(v => v[0].toUpperCase() + v.slice(1))
                .join(" ");
        },
        ripeUrl() {
            return this.$store.state.ripe_url;
        },
        error() {
            return this.$store.state.error;
        },
        errorMessage() {
            return this.error;
        },
        modelError() {
            return this.error;
        },
        modelLoaded() {
            return Boolean(this.error) === false && Object.keys(this.config).length > 0;
        }
    },
    mounted: function() {
        this.$bus.bind("refresh", this.$forceUpdate);
    }
};

export { logicMixin };
