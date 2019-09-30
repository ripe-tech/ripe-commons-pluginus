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
            return this.error && this.error.message ? this.error.message : null;
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
    },
    methods: {
        /**
         * Checks if two 'initialsExtra' are different.
         *
         * @param {Object} some One of the 'initialsExtra' being compared.
         * @param {Object} some The other 'initialsExtra' being compared.
         * @return {Boolean} Returns 'true' if they're different.
         */
        diffInitialsExtra(some, other) {
            if (Boolean(some) !== Boolean(other)) {
                return true;
            }

            if (!this._subsetInitialsExtra(some, other)) {
                return true;
            }

            if (!this._subsetInitialsExtra(other, some)) {
                return true;
            }

            return false;
        },
        _subsetInitialsExtra(base, superset) {
            for (const group of Object.keys(base)) {
                const groupBase = base[group];
                const groupSuperSet = superset[group];

                if (!groupSuperSet) {
                    return false;
                }

                if (
                    groupBase.initials !== groupSuperSet.initials ||
                    groupBase.engraving !== groupSuperSet.engraving
                ) {
                    return false;
                }
            }

            return true;
        }
    }
};

export { logicMixin };
