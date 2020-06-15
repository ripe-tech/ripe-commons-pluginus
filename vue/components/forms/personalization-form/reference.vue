<template>
    <div class="generic-personalization">
        <initials-images
            v-bind:brand="brand"
            v-bind:model="model"
            v-bind:groups="groups"
            v-bind:initials-builder="__initialsBuilder"
        />
        <div class="form">
            <div class="form-group" v-for="group in groups" v-bind:key="group">
                <p class="subtitle">
                    {{ "ripe_commons.personalization.group" | locale }} {{ group }}
                </p>
                <form-input
                    v-bind:header="(`properties.${type}`, readable(capitalize(type))) | locale"
                    v-bind:header-size="'large'"
                    v-for="[type, options] in Object.entries(properties)"
                    v-bind:key="type"
                >
                    <select-ripe
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
                        v-bind:placeholder="'ripe_commons.personalization.add_initials' | locale"
                        v-bind:value.sync="initialsText[group]"
                    />
                </form-input>
            </div>
        </div>
    </div>
</template>

<style scoped>
.generic-personalization {
    max-width: 100%;
    min-width: 600px;
}

body.tablet .generic-personalization,
body.mobile .generic-personalization {
    min-width: 100%;
}

body.tablet .generic-personalization > .initials-images,
body.mobile .generic-personalization > .initials-images {
    display: flex;
}

.generic-personalization > .initials-images ::v-deep .initials-image {
    border-radius: 50%;
    margin-right: 30px;
    max-height: 300px;
}

body.tablet .generic-personalization > .initials-images ::v-deep .initials-image,
body.mobile .generic-personalization > .initials-images ::v-deep .initials-image {
    width: auto;
}

.generic-personalization > .initials-images ::v-deep .initials-image:last-of-type {
    margin-right: 0px;
}

.generic-personalization > .form {
    display: flex;
    justify-content: center;
}

.generic-personalization > .form > .form-group {
    margin-right: 30px;
    width: 100%;
}

.generic-personalization > .form > .form-group:last-of-type {
    margin-right: 0px;
}

.generic-personalization > .form > .form-group > .subtitle {
    font-size: 14px;
    margin: 16px 0px 20px 0px;
    text-transform: capitalize;
}

.generic-personalization > .form > .form-group > .form-input {
    margin-bottom: 20px;
    text-align: left;
}
</style>

<script>
import formInterface from "./interface.js";

export const Reference = {
    name: "reference-personalization",
    mixins: [formInterface],
    data: function() {
        return {
            propertiesData: {},
            initialsText: {},
            groups: []
        };
    },
    computed: {
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
            await this.refresh();

            // clean personalization when switching models
            this.reset();
        });
        await this.refresh();
    },
    destroyed: function() {
        if (this.onPostConfig) this.$bus.unbind(this.onPostConfig);
    },
    methods: {
        async refresh() {
            try {
                this.groups = await this.$ripe.runLogicP({
                    brand: this.brand,
                    model: this.model,
                    method: "groups"
                });
            } catch (err) {
                // gives a default group if builds does not support logic
                this.groups = ["main"];
            }

            // when loading a model with a personalization already set (URL)
            // the setState is called first, so the state of personalization
            // must be conserved
            this.groups.forEach(group => {
                this.propertiesData[group] = this.propertiesData[group]
                    ? this.propertiesData[group]
                    : {};
            });
        },
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

                    ["font", "style"].forEach(propertyName => {
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
        getPropertyOptions(propertyType) {
            return this.configInitials.properties
                .filter(property => property.type === propertyType)
                .map(property => ({ value: property.name, label: property.name }));
        },
        propertiesToEngraving(group = null) {
            group = group || Object.keys(this.propertiesData)[0];
            if (!group) return "";
            return Object.entries(this.propertiesData[group])
                .filter(([type, value]) => Boolean(value))
                .map(([type, value]) => `${type}:${value}`)
                .join(".");
        },
        engravingToProperties(engraving, group) {
            engraving.split(".").map(engravingPart => {
                const [property, value] = engravingPart.split(":", 2);
                this.onValueUpdate(value, group, property);
            });
        },
        __initialsBuilder(initials, engraving, element) {
            const group = element.getAttribute("data-group");
            const personalizationProfiles = this.__getPersonalizationProfiles(group);
            const profiles = [...personalizationProfiles];

            Object.entries(this.propertiesData[group]).forEach(([type, value]) => {
                this.groups.length > 1 && profiles.push(value + ":" + group);
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
        },
        onValueUpdate(value, group, type) {
            const newProperties = { ...this.propertiesData };
            if (!newProperties[group]) newProperties[group] = {};
            newProperties[group][type] = value;
            this.propertiesData = newProperties;
        }
    }
};

export default Reference;
</script>
