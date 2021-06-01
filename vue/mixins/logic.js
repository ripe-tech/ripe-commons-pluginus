import { initialsFromExtra } from "../../js/util";

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
        initialsMinimumCharacters() {
            return this.$store.state.initialsMinimumCharacters;
        },
        initialsMaximumCharacters() {
            return this.$store.state.initialsMaximumCharacters;
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
            return this.$store.state.ripeUrl;
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
         * Resolves both the main initials and engraving taking into consideration
         * the provided initials extra as a fallback process.
         *
         * @param {Object} initialsExtra The dictionary structure associating
         * the multiple initials groups with their initials engraving values.
         * @param {String} initials The initials to be used as override if any.
         * @param {String} engraving The engraving to be used as override if any.
         * @returns {Object} The normalized initials and engraving values withing
         * an object resolved according to the provided initials extra (main group)
         * or the initials and engraving parameters.
         */
        initialsFromExtra(initialsExtra, initials = undefined, engraving = undefined) {
            return initialsFromExtra(initialsExtra, initials, engraving);
        },
        /**
         * Checks if the initials are valid according to a naive implementation
         * where validation is done against the maximum, minimum and supported
         * characters that don't take into account the initials group or the
         * current ctx.
         *
         * This method should be used carefully to avoid erroneous validation
         * of the initials not compliant with generic logic implementation.
         *
         * @param {String} initials The initials string value to validate.
         * @return {Boolean} Whether the initials are valid according to the naive
         * value of maximum and minimum initials.
         */
        initialsWithinRange(initials) {
            if (initials === null || initials === undefined) return true;
            if (
                this.$store.state.initialsSupportedCharacters === undefined ||
                this.$store.state.initialsSupportedCharacters === null ||
                this.$store.state.initialsMinimumCharacters === undefined ||
                this.$store.state.initialsMinimumCharacters === null ||
                this.$store.state.initialsMaximumCharacters === undefined ||
                this.$store.state.initialsMaximumCharacters === null
            ) {
                return true;
            }

            if (initials.length > this.$store.state.initialsMaximumCharacters) return false;
            if (initials.length < this.$store.state.initialsMinimumCharacters) return false;

            return [...initials].every(initial =>
                this.$store.state.initialsSupportedCharacters.includes(initial)
            );
        },
        /**
         * Checks if for every group either has everything set (initials and
         * all properties) or nothing, representing a simple validation process.
         *
         * This verification can be used to determine if the provided groups
         * of initials and properties are valid according to general build
         * based properties definition.
         *
         * @param {Array} groups The sequence with the names of the groups that
         * are going to be validated.
         * @param {Object} groupInitials Am object that maps a certain group
         * to the initials associated with that group.
         * @param {Object} groupProperties An object that maps a group name
         * into an object that associates a property name to a value.
         * @param {Number} properties The object that contains the definition of
         * the properties that are going to be validated, to be used in the
         * evaluation of the expected properties count. This map associates the
         * property name with a sequence of all of its possible values.
         * @return {Boolean} Whether every group either has everything set
         * (initials and all properties) or nothing.
         */
        allPropertiesOrEmpty(
            groups = [],
            groupInitials = {},
            groupProperties = {},
            properties = {}
        ) {
            // computes the expected number of properties as the length
            // of the properties dictionary
            const expectedPropertiesCount = Object.keys(properties).length;

            // consider groups valid whenever, for all groups, we either
            // have no initials (and no properties for engraving are set)
            // or we have initials and all expected properties are set
            return groups.every(group => {
                const initials = groupInitials[group];
                const hasInitials = Boolean(initials);
                const propertiesCount = Object.values(groupProperties[group] || {}).filter(
                    v => v !== null && v !== undefined
                ).length;
                return (
                    (!hasInitials && propertiesCount === 0) ||
                    (hasInitials &&
                        this.initialsWithinRange(initials) &&
                        propertiesCount === expectedPropertiesCount)
                );
            });
        },
        /**
         * Checks if two 'parts' are equal, by using a deep comparison
         * analysis. Equality is defined as, they produce the same
         * result in a subset compare..
         *
         * @param {Object} first The first of the 'parts' being compared.
         * @param {Object} second The second of the 'parts' being compared.
         * @return {Boolean} Returns the result of the deep comparison.
         */
        equalParts(first, second) {
            if (!first && !second) return true;

            if (Boolean(first) !== Boolean(second)) {
                return false;
            }

            if (!this._subsetCompareParts(first, second)) {
                return false;
            }

            if (!this._subsetCompareParts(second, first)) {
                return false;
            }

            return true;
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

            if (!this._subsetCompareInitials(firstS, secondS)) {
                return false;
            }

            if (!this._subsetCompareInitials(secondS, firstS)) {
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
        sanitizeInitialsExtra(initialsExtra, minimize = true, override = false) {
            let initialsExtraS = {};
            Object.entries(initialsExtra).forEach(([group, { initials, engraving }]) => {
                if (!initials && minimize) return;
                initialsExtraS[group] = {
                    initials: initials || "",
                    engraving: initials ? engraving || null : null
                };
            });
            if (override) {
                for (const key of Object.keys(initialsExtra)) delete initialsExtra[key];
                initialsExtraS = Object.assign(initialsExtra, initialsExtraS);
            }
            return initialsExtraS;
        },
        /**
         * Checks whether the engraving is set when the initials are not.
         *
         * @param {String} initials The initials to validate.
         * @param {String} engraving The engraving to validate.
         * @param {Object} initialsExtra A map from groups to initials and engraving
         * to validate.
         * @returns {Boolean} If there is any group with engraving but no initials.
         */
        engravingWithoutInitials(initials, engraving, initialsExtra = {}) {
            return Boolean(
                (engraving && !initials) ||
                    Object.values(initialsExtra).find(group => group.engraving && !group.initials)
            );
        },
        _subsetCompareParts(base, reference) {
            for (const name of Object.keys(base)) {
                // retrieves the part information for the current
                // name in iteration for both the base and the
                // reference set values (to be compared)
                const partB = base[name];
                const partR = reference[name];

                // if for a certain base part the corresponding
                // part does not exist in the reference then the
                // reference is considered to be invalid
                if (!partR) {
                    return false;
                }

                // in case either the initials or the engraving is
                // not matching then the subset is invalid
                if (partB.material !== partR.material || partB.color !== partR.color) {
                    return false;
                }
            }

            return true;
        },
        _subsetCompareInitials(base, reference) {
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
