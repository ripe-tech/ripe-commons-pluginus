<template>
    <div class="reference-personalization">
        <initials-images
            v-bind:brand="brand"
            v-bind:model="model"
            v-bind:groups="groups"
            v-bind:initials-builder="__initialsBuilder"
            v-bind:image-height="imageHeight"
            v-bind:image-border-radius="imageBorderRadius"
        />
        <div class="form">
            <div class="form-group" v-for="group in groups" v-bind:key="group">
                <p class="subtitle" v-if="showGroupLabel(group)">
                    {{ locale("ripe_commons.personalization.group") }}
                    {{ locale(`ripe_commons.group.${group}`, readable(capitalize(group))) }}
                </p>
                <form-input
                    v-bind:header="
                        locale(`ripe_commons.properties.${type}`, readable(capitalize(type)))
                    "
                    v-bind:header-size="'large'"
                    v-for="[type, options] in Object.entries(properties())"
                    v-bind:key="type"
                >
                    <select-ripe
                        v-bind:class="`select-${type}`"
                        v-bind:placeholder="locale(`ripe_commons.personalization.select.${type}`)"
                        v-bind:options="options"
                        v-bind:value="propertiesData[group][type]"
                        v-on:update:value="value => onValueUpdate(value, group, type)"
                    />
                </form-input>
                <form-input
                    v-bind:header="locale('ripe_commons.personalization.initials')"
                    v-bind:header-size="'large'"
                >
                    <input-ripe
                        class="input-initials"
                        v-bind:placeholder="locale('ripe_commons.personalization.add_initials')"
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
    margin-right: 30px;
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
            default: () => ["font", "font_size", "style", "position", "color"]
        }
    },
    data: function() {
        return {
            /**
             * Dictionary that maps each initials group to objects that map each
             * of the property types with the selected value. This is a dictionary
             * based representation of the engraving.
             */
            propertiesData: {},

            /**
             * An object that maps for each group the value (text) of the initials.
             */
            initialsText: {},

            /**
             * The name of the groups that are currently available for personalization.
             */
            groups: [],

            /**
             * The height (in pixels) of the image that is going to be used to
             * display the personalization initials.
             */
            imageHeight: 300
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
        configMeta() {
            return this.$store.state.config.meta || {};
        },
        /**
         * The radius of the border for the image that is going to be used in
         * the display of the initials.
         */
        imageBorderRadius() {
            if (!this.$store.state.hasInitialsRadius) return "0px";
            return this.configMeta?.initials_image?.border_radius || "50%";
        },
        state() {
            return {
                initials: this.__getInitialsText(),
                engraving: this.propertiesToEngraving(),
                initialsExtra: this.__getInitials()
            };
        },
        valid() {
            return this.allPropertiesOrEmpty(
                this.groups,
                this.initialsText,
                this.propertiesData,
                this.properties()
            );
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
        },
        valid: {
            handler: function(value) {
                this.$emit("update:valid", value);
            },
            immediate: true
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

                        // if there is only one single option,
                        // then don't include it in the tab message
                        const availableProperties = this.properties()[propertyName] || [];
                        if (availableProperties.length < 2) return;

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
            // updates the preferred initials image display settings using the meta
            // information present in the model's configuration (if existent)
            const initialsImage = this.configMeta.initials_image || {};
            this.imageHeight = initialsImage.height === undefined ? 300 : initialsImage.height;

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
        showGroupLabel(group) {
            return this.groups.length > 1 && group !== "main";
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
         * @param {Element} element The DOM element to be used in the "calculus" of the
         * final initials object.
         * @returns {Object} The computed initials object containing both the final
         * initials string value and profile(s) sequence.
         */
        __initialsBuilder(initials, engraving, element) {
            // uses the provided element to obtain the selected group and obtains the
            // "base" personalization profiles for such group
            const group = element.getAttribute("data-group");
            const profiles = this.__getPersonalizationProfiles(group);

            // iterates over each of the properties for the groups and builds the base
            // profiles with the property value with the group suffix and the basic
            // profile with "just" the property value
            Object.entries(this.propertiesData[group]).forEach(([type, value]) => {
                if (this.groups.length > 1) profiles.push(value + ":" + group);
                profiles.push(value);
            });

            profiles.push(group);

            return {
                initials: initials,
                profile: profiles
            };
        },
        __getPersonalizationProfiles(group) {
            const alias = this.configInitials.$alias;
            if (!alias) return [];

            const position = this.propertiesData[group] && this.propertiesData[group].position;

            return []
                .concat(
                    position && group ? alias[`step::personalization:${position}:${group}`] : [],
                    position ? alias[`step::personalization:${position}`] : [],
                    group ? alias[`step::personalization:${group}`] : [],
                    alias["step::personalization"]
                )
                .filter(v => v !== undefined);
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
