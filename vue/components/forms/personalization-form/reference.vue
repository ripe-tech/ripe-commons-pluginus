<template>
    <div class="reference-personalization">
        <initials-images
            v-bind:brand="brand"
            v-bind:model="model"
            v-bind:groups="groups"
            v-bind:initials-builder="__initialsBuilder"
            v-bind:context-getter="__getContext"
        />
        <div class="form">
            <div class="form-group" v-for="group in groups" v-bind:key="group">
                <p class="subtitle">
                    {{ "ripe_commons.personalization.group" | locale }} {{ group }}
                </p>
                <form-input
                    v-bind:header="(`properties.${type}`, readable(capitalize(type))) | locale"
                    v-bind:header-size="'large'"
                    v-for="[type, options] in Object.entries(properties())"
                    v-bind:key="type"
                >
                    <select-ripe
                        v-bind:class="`select-${type}`"
                        v-bind:placeholder="`ripe_commons.personalization.select.${type}` | locale"
                        v-bind:options="options"
                        v-bind:value="propertiesData[group][type]"
                        v-on:update:value="value => onValueUpdate(value, group, type)"
                    />
                </form-input>
                <form-input
                    v-bind:header="'ripe_commons.personalization.initials' | locale"
                    v-bind:header-size="'large'"
                >
                    <input-ripe
                        class="input-initials"
                        v-bind:placeholder="'ripe_commons.personalization.add_initials' | locale"
                        v-bind:value.sync="initialsText[group]"
                    />
                </form-input>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reference-personalization {
    max-width: 100%;
    min-width: 600px;
}

body.tablet .reference-personalization,
body.mobile .reference-personalization {
    min-width: 100%;
}

body.tablet .reference-personalization > .initials-images,
body.mobile .reference-personalization > .initials-images {
    display: flex;
}

.reference-personalization > .initials-images ::v-deep .initials-image {
    border-radius: 50%;
    margin-right: 30px;
    max-height: 300px;
}

body.tablet .reference-personalization > .initials-images ::v-deep .initials-image,
body.mobile .reference-personalization > .initials-images ::v-deep .initials-image {
    width: auto;
}

.reference-personalization > .initials-images ::v-deep .initials-image:last-of-type {
    margin-right: 0px;
}

.reference-personalization > .form {
    display: flex;
    justify-content: center;
}

.reference-personalization > .form > .form-group {
    margin-right: 30px;
    width: 100%;
}

.reference-personalization > .form > .form-group:last-of-type {
    margin-right: 0px;
}

.reference-personalization > .form > .form-group > .subtitle {
    font-size: 14px;
    margin: 16px 0px 20px 0px;
    text-transform: capitalize;
}

.reference-personalization > .form > .form-group > .form-input {
    margin-bottom: 20px;
    text-align: left;
}
</style>

<script>
import formInterface from "./interface.js";

export const Reference = {
    name: "reference-personalization",
    mixins: [formInterface],
    props: {
        /**
         * The sequence of property names for the properties that are
         * going to have their values used as part of the tab message
         * string construction process.
         */
        tabProperties: {
            type: Array,
            default: () => ["font", "style"]
        }
    },
    data: function() {
        return {
            /**
             * Dictionary that maps each initials group to tuples that define the
             * value for each of the initials properties.
             */
            propertiesData: {},
            initialsText: {},
            groups: []
        };
    },
    computed: {
        brand() {
            return this.$store.state.brand;
        },
        model() {
            return this.$store.state.model;
        },
        configInitials() {
            return this.$store.state.config.initials;
        },
        state() {
            return {
                initials: this.__getInitialsText(),
                engraving: this.propertiesToEngraving(),
                initialsExtra: this.__getInitials()
            };
        }
    },
    watch: {
        state: {
            handler: function() {
                this.$emit("changed", this);
            },
            deep: true
        },
        propertiesData: {
            handler: function() {
                this.$ripe.update();
            }
        }
    },
    created: async function() {
        this.onPostConfig = this.$bus.bind("post_config", async (config, options) => {
            // re-runs the refresh operation so that the
            // target groups for personalization are updated
            await this.refresh();

            // clean personalization when switching models
            // as it may not be directly compatible
            this.reset();
        });
        this.onLocaleMapChanged = this.$bus.bind("locale_map_changed", () => this.$forceUpdate());

        // runs the initial refresh operation to obtain the
        // model's target initials groups
        await this.refresh();
    },
    destroyed: function() {
        if (this.onLocaleMapChanged) this.$bus.unbind(this.onLocaleMapChanged);
        if (this.onPostConfig) this.$bus.unbind(this.onPostConfig);
    },
    methods: {
        reset() {
            this.propertiesData = {};
            this.groups.forEach(group => {
                this.propertiesData[group] = {};
            });
            this.initialsText = {};
        },
        setState(state) {
            this.reset();

            const initialsExtra = state.initialsExtra || {};
            for (const group in initialsExtra) {
                const initials = initialsExtra[group].initials || "";
                this.$set(this.initialsText, group, initials);

                const engraving = initialsExtra[group].engraving || "";
                this.$set(this.propertiesData, group, {});
                this.engravingToProperties(engraving, group);
            }
        },
        getState() {
            return this.state;
        },
        getTabMessage() {
            return Object.entries(this.initialsText)
                .map(([group, initials]) => {
                    const text = [initials];

                    this.tabProperties.forEach(propertyName => {
                        const property = this.propertiesData[group][propertyName];
                        if (!property) return;

                        text.push(
                            this.locale(
                                `properties.${propertyName}.${property}`,
                                this.readable(this.capitalize(property))
                            )
                        );
                    });

                    return text.join(" ");
                })
                .join(" ");
        },
        async refresh() {
            try {
                // runs the remote business logic to obtain the multiple
                // target groups available for initials
                this.groups = await this.$ripe.runLogicP({
                    brand: this.brand,
                    model: this.model,
                    method: "groups"
                });
            } catch (err) {
                // gives a default group if builds does not support remote
                // business logic (for the groups "method")
                this.groups = ["main"];
            }

            // when loading a model with a personalization already set (URL)
            // the `setState()` is called first, so the state of personalization
            // must be conserved
            this.groups.forEach(group => {
                this.propertiesData[group] = this.propertiesData[group]
                    ? this.propertiesData[group]
                    : {};
            });
        },
        properties() {
            const properties = this.configInitials.properties.map(property => ({
                value: property.name,
                label: this.locale(
                    `properties.${property.type}.${property.name}`,
                    this.readable(this.capitalize(property.name))
                ),
                type: property.type
            }));
            const result = {};
            properties.forEach(property => {
                result[property.type] = result[property.type] || [];
                result[property.type].push(property);
            });
            return result;
        },
        propertiesToEngraving(group = null) {
            group = group || Object.keys(this.propertiesData)[0];
            if (!group) return "";
            return Object.entries(this.propertiesData[group])
                .filter(([type, value]) => Boolean(value))
                .map(([type, value]) => `${value}:${type}`)
                .join(".");
        },
        engravingToProperties(engraving, group) {
            const { valuesM } = this.$ripe.parseEngraving(engraving);
            Object.entries(valuesM).forEach(([property, value]) => {
                this.onValueUpdate(value, group, property);
            });
        },
        onValueUpdate(value, group, type) {
            const newProperties = { ...this.propertiesData };
            if (!newProperties[group]) newProperties[group] = {};
            newProperties[group][type] = value;
            this.propertiesData = newProperties;
        },
        /**
         * "Generic" initials builder function that uses the current properties
         * context to build a series of extra profiles.
         *
         * This function is compliant with the expected initials builder interface.
         *
         * @param {String} initials The value of the initials to compute the computed
         * initials object.
         * @param {String} engraving The value of the engraving to compute the computed
         * initials object.
         * @param {Object} properties The initials properties of the build.
         * @param {String} group The value of the initials group.
         * @returns {Object} The computed initials object containing both the final
         * initials string value and profile(s) sequence.
         */
        __initialsBuilder(initials, engraving, element) {
            const group = element.getAttribute("data-group");

            const profiles = [{ type: group, name: group }];
            Object.entries(this.propertiesData[group]).forEach(([type, value]) => {
                profiles.push({ type: type, name: value });
            });

            return {
                initials: initials,
                profile: profiles
            };
        },
        __getContext(engraving, group) {
            const position = this.propertiesData[group] && this.propertiesData[group].position;
            const contexts = [`step::personalization:${group}`, "step::personalization"];
            if (!position) return contexts;

            return [
                `step::personalization:${position}:${group}`,
                `step::personalization:${position}`,
                ...contexts
            ];
        },
        __getInitials() {
            const _initials = {};
            for (const name in this.initialsText) {
                const group = {
                    initials: this.initialsText[name],
                    engraving: this.propertiesToEngraving(name)
                };
                _initials[name] = group;
            }
            return _initials;
        },
        __getInitialsText() {
            const group =
                Object.keys(this.initialsText).length > 0
                    ? Object.keys(this.initialsText)[0]
                    : null;
            return group ? this.initialsText[group] : "";
        }
    }
};

export default Reference;
</script>
