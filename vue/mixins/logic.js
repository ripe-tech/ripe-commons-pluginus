export const logicMixin = {
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
        modelVariant() {
            return this.$store.state.variant;
        },
        modelVersion() {
            return this.$store.state.version;
        },
        productId() {
            return this.$store.state.product_id;
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
        __initialsBuilder(initials, engraving, element) {
            const group = element.getAttribute("data-group");
            const properties = engraving
                ? this.$ripe.parseEngraving(engraving, this.configInitials.properties).valuesM
                : {};
            const profiles = this.__getPersonalizationProfiles(group, properties);

            Object.entries(properties).forEach(([type, value]) => {
                this.initialGroups.length > 1 && profiles.push(value + ":" + group);
                profiles.push(value);
            });

            profiles.push(group);

            return {
                initials: initials || "$empty",
                profile: profiles
            };
        },
        __getPersonalizationProfiles(group, properties) {
            const alias = this.configInitials.$alias;
            if (!alias) return [];

            const position = properties.position;

            return []
                .concat(
                    position && group ? alias[`step::personalization:${position}:${group}`] : [],
                    position ? alias[`step::personalization:${position}`] : [],
                    group ? alias[`step::personalization:${group}`] : [],
                    alias["step::personalization"]
                )
                .filter(v => v !== undefined);
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
