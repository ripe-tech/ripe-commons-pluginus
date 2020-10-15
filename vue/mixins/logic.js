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
        initialsGroups() {
            return this.$store.state.initialsGroups;
        },
        initialsSupportedCharacters() {
            return this.$store.state.initialsSupportedCharacters;
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
        },
        /**
         * Default initials builder implementation that uses a series of
         * pref-defined heuristics that take into account: engraving, group and
         * properties.
         *
         * The results provided should be enough to handle most of the personalization
         * scenarios.
         *
         * @param {String} initials The string that contains the initials that are
         * going to be used in the building process.
         * @param {String} engraving The engraving string value to be used.
         * @param {HTMLElement} element The HTML element reference to the image that
         * is going to use the generated initials and profile object.
         * @returns {Object} An object that defined both `initials` and `profiles`
         * according to the provided parameters.
         */
        __initialsBuilder(initials, engraving, element) {
            // uses the provided element to obtain the selected group and obtains the
            // "base" personalization profiles for such group
            const group = element.getAttribute("data-group");
            const properties = engraving
                ? this.$ripe.parseEngraving(engraving, this.config.initials.properties).valuesM
                : {};
            const profiles = [{ type: group, name: group }];

            // iterates over each of the properties for the groups and builds the base
            // profiles with the property value with the group suffix and the basic
            // profile with "just" the property value
            Object.entries(properties).forEach(([type, value]) => {
                profiles.push({ type: type, name: value });
            });

            return {
                initials: initials || "$empty",
                profile: profiles
            };
        },
        /**
         * "Generic" context builder function that returns the context for te initials
         * based on the position in the current properties and the current group.
         *
         * @param {String} initials The string that contains the initials that are
         * going to be used in the building process.
         * @param {String} engraving The value of the engraving of the current personalization.
         * @param {String} group The value of the initials group.
         */
        __getContext(initials, engraving, group) {
            const properties = engraving
                ? this.$ripe.parseEngraving(engraving, this.config.initials.properties).valuesM
                : {};
            const position = properties.position;

            const contexts = [`step::personalization:${group}`, "step::personalization"];
            if (!position) return contexts;

            return [
                `step::personalization:${position}:${group}`,
                `step::personalization:${position}`,
                ...contexts
            ];
        }
    }
};
