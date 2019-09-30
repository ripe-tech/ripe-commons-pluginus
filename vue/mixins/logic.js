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
         * Checks if two 'initialsExtra' are different, by using a deep
         * comparison analysis.
         *
         * @param {Object} first The first of the 'initialsExtra' being compared.
         * @param {Object} second The second of the 'initialsExtra' being compared.
         * @return {Boolean} Returns the result of the deep comparison.
         */
        diffInitialsExtra(first, second) {
            if (Boolean(first) !== Boolean(second)) {
                return true;
            }

            if (!this._subsetInitialsExtra(first, second)) {
                return true;
            }

            if (!this._subsetInitialsExtra(second, first)) {
                return true;
            }

            return false;
        },
        _subsetInitialsExtra(base, superset) {
            for (const group of Object.keys(base)) {
                const groupBase = base[group];
                const groupSuperSet = superset[group];

                // if for a certain base group the corresponding
                // group does not exist in the super set then the
                // super set is considered to be invalid
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
