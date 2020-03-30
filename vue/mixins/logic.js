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
        modelConfigured() {
            return Object.keys(this.config).length > 0;
        },
        modelLoaded() {
            return this.modelConfigured && Boolean(this.error) === false;
        }
    },
    mounted: function() {
        this.$bus.bind("refresh", this.$forceUpdate);
    },
    methods: {
        /**
         * Checks if two 'initialsExtra' are equal, by using a deep
         * comparison analysis. Equality is defined as, they produce
         * the same result after sanitization.
         *
         * @param {Object} first The first of the 'initialsExtra' being compared.
         * @param {Object} second The second of the 'initialsExtra' being compared.
         * @return {Boolean} Returns the result of the deep comparison.
         */
        equalInitialsExtra(first, second) {
            if (Boolean(first) !== Boolean(second)) {
                return false;
            }

            const firstS = this.sanitizeInitialsExtra(first);
            const secondS = this.sanitizeInitialsExtra(second);

            if (!this._subsetCompare(firstS, secondS)) {
                return false;
            }

            if (!this._subsetCompare(secondS, firstS)) {
                return false;
            }

            return true;
        },
        diffInitialsExtra(first, second) {
            return !this.equalInitialsExtra(first, second);
        },
        sanitizeInitials(initials, engraving) {
            return [initials || "", initials ? engraving || null : null];
        },
        sanitizeInitialsExtra(initialsExtra) {
            const initialsExtraS = {};
            Object.entries(initialsExtra).forEach(([group, { initials, engraving }]) => {
                initialsExtraS[group] = {
                    initials: initials || "",
                    engraving: initials ? engraving || null : null
                };
            });
            return initialsExtraS;
        },
        _subsetCompare(base, reference) {
            for (const name of Object.keys(base)) {
                // retrieves the group information for the current
                // name in iteration for both the base and the
                // reference set values (to be compared)
                const groupB = base[name];
                const groupR = reference[name];

                // if for a certain base group the corresponding
                // group does not exist in the reference then the
                // reference is considered to be invalid
                if (!groupR) {
                    return false;
                }

                // in case either the initials or the engraving is
                // not matching then the subset is invalid
                if (groupB.initials !== groupR.initials || groupB.engraving !== groupR.engraving) {
                    return false;
                }
            }

            return true;
        }
    }
};

export { logicMixin };
