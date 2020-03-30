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
        },
        initialsTextGroup() {
            const personalization = this.$store.state.personalization;
            if (!personalization.initialsExtra) return null;

            const initials = {};
            for (const group in personalization.initialsExtra) {
                const text = personalization.initialsExtra[group].initials;
                if (!text.length || text === "$blank") {
                    continue;
                }
                initials[group] = text.toUpperCase();
            }

            return initials;
        },
        initialsTextSingle() {
            return this.getNormalizedInitials();
        },
        engravingLocalized() {
            const engraving = this.$store.state.personalization.engraving;
            if (!engraving) return "";

            const initialsConfig = this.$store.state.config.initials;
            if (!initialsConfig) return engraving;

            const { values } = this.$ripe.parseEngraving(engraving, initialsConfig.properties);

            return values
                .map(property => this.localeModelProperty(property.name, property.type))
                .filter(localizedProperty => localizedProperty.length)
                .join(" ");
        }
    },
    mounted: function() {
        this.$bus.bind("refresh", this.$forceUpdate);
    },
    methods: {
        /**
         * Normalizes the internal initials structure into a single string
         * using either the initials extra values or the "base" initials string.
         *
         * Some aspects of the string generation may be controller like the separator
         * in between the initials groups and the dash value.
         *
         * @param {String} separator The separator to be used in between multiple
         * groups of initials on the string generation.
         * @param {String} dash The dash separator between the group name and the
         * initials (concrete) value for the group.
         * @returns {String} The normalizes initials text string for the provided
         * order object.
         */
        getNormalizedInitials(separator = " ", dash = ":") {
            const personalization = this.$store.state.personalization;
            if (personalization.initialsExtra) {
                let initials = "";
                let isFirst = true;
                for (const group in personalization.initialsExtra) {
                    const text = personalization.initialsExtra[group].initials;
                    if (!text.length || text === "$blank") continue;
                    if (isFirst) isFirst = false;
                    else initials += separator;
                    initials += `${this.capitalize(group)}${dash} ${text.toUpperCase()}`;
                }
                return initials.trim();
            } else if (personalization.initials) {
                return personalization.initials.toUpperCase();
            }
            return "";
        },
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
