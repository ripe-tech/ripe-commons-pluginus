<template>
    <div class="generic-personalization">
        <initials-images
            v-bind:brand="brand"
            v-bind:model="model"
            v-bind:groups="groups"
            v-bind:initials-builder="__initialsBuilder"
            ref="initialsImages"
        />
        <div class="form">
            <div class="form-group" v-for="group in groups" v-bind:key="group">
                <p class="subtitle">
                    {{ "ripe_commons.personalization.group" | locale }} {{ group }}
                </p>
                <form-input
                    v-bind:header="'Position'"
                    v-bind:header-size="'large'"
                    v-if="positions.length !== 0"
                >
                    <select-ripe
                        v-bind:placeholder="'Select the position'"
                        v-bind:options="positions"
                        v-bind:value.sync="positionData[group]"
                    />
                </form-input>
                <form-input
                    v-bind:header="'Style'"
                    v-bind:header-size="'large'"
                    v-if="styles.length !== 0"
                >
                    <select-ripe
                        v-bind:placeholder="'Select the style'"
                        v-bind:options="styles"
                        v-bind:value.sync="styleData[group]"
                    />
                </form-input>
                <form-input
                    v-bind:header="'Font'"
                    v-bind:header-size="'large'"
                    v-if="fonts.length !== 0"
                >
                    <select-ripe
                        v-bind:placeholder="'Select the font'"
                        v-bind:options="fonts"
                        v-bind:value.sync="fontData[group]"
                    />
                </form-input>
                <form-input v-bind:header="'Initials*'" v-bind:header-size="'large'">
                    <input-ripe
                        v-bind:placeholder="'Add Initials'"
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

.generic-personalization > .initials-images ::v-deep .initials-image {
    border-radius: 50%;
    margin-right: 30px;
    max-height: 300px;
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
    margin-top: 10px;
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
            positionData: {},
            styleData: {},
            fontData: {},
            initialsText: {},
            groups: [],
            fontEngraving: ""
        };
    },
    computed: {
        brand() {
            return this.$store.state.brand;
        },
        model() {
            return this.$store.state.model;
        },
        fonts() {
            return this.$store.state.config.initials.properties
                .filter(property => property.type === "font")
                .map(property => ({ value: property.name, label: property.name }));
        },
        positions() {
            return this.$store.state.config.initials.properties
                .filter(property => property.type === "position")
                .map(property => ({ value: property.name, label: property.name }));
        },
        styles() {
            return this.$store.state.config.initials.properties
                .filter(property => property.type === "style")
                .map(property => ({ value: property.name, label: property.name }));
        },
        state() {
            // font engraving is used to force the refresh of state after setState
            return {
                initials: this.__getInitialsText(),
                engraving: this.__getEngraving() || this.fontEngraving,
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
        }
    },
    mounted: async function() {
        await this.getGroups();
    },
    methods: {
        async show() {
            await this.getGroups();
        },
        reset() {
            this.positionData = {};
            this.styleData = {};
            this.fontData = {};
            this.initialsText = {};

            this.setState({});
        },
        setState(state) {
            const initialsExtra = state.initialsExtra || {};
            console.log("INITIALS EXTRA", JSON.stringify(initialsExtra));
            for (const name in initialsExtra) {
                this.initialsText[name] = initialsExtra[name].initials || "";
                this.fontData[name] =
                    (initialsExtra[name].engraving &&
                        initialsExtra[name].engraving.split(":")[0]) ||
                    "";
                this.fontEngraving = this.fontData[name] || "";
            }
            console.log("INITIALS EXTRA AFTER", JSON.stringify(this.initialsText), JSON.stringify(this.fontData));
        },
        getState() {
            return this.state;
        },
        getTabMessage() {
            const initials = [];
            const engravings = [];
            for (const name in this.initialsText) {
                const initialsText = this.initialsText[name];
                if (!initialsText) continue;
                initials.push(initialsText);

                const engraving = this.fontData[name]
                    ? this.locale(
                          "properties.font." + this.fontData[name].split(":")[0],
                          this.readable(this.capitalize(this.fontData[name]))
                      )
                    : "";
                engravings.push(engraving);
            }

            return initials.length ? initials.join(" ") + " " + engravings.join(" ") : "";
        },
        async getGroups() {
            try {
                this.groups = await this.$ripe.getLogicP({
                    brand: this.$store.state.brand,
                    model: this.$store.state.model,
                    method: "groups"
                });
            } catch (err) {
                // if a build has no support for groups, had a default
                this.groups = ["main"];
            }
        },
        __initialsBuilder(initials, engraving, element) {
            const group = element.getAttribute("data-group");
            const viewport = this.__getViewport(group);
            const profiles = [];

            if (this.fontData[group]) {
                this.groups.length > 1 && profiles.push(this.fontData[group] + ":" + group);
                profiles.push(this.fontData[group] + ":" + viewport, this.fontData[group]);
            }

            if (this.positionData[group]) {
                this.groups.length > 1 && profiles.push(this.positionData[group] + ":" + group);
                profiles.push(this.positionData[group]);
            }

            if (this.styleData[group]) {
                this.groups.length > 1 && profiles.push(this.styleData[group] + ":" + group);
                profiles.push(this.styleData[group]);
            }

            this.groups.length > 1 && profiles.push(group + ":" + viewport, group);
            profiles.push(viewport);

            return {
                initials: initials,
                profile: profiles
            };
        },
        __getInitials() {
            const _initials = {};
            for (const name in this.initialsText) {
                const group = {
                    initials: this.initialsText[name],
                    engraving: this.__buildEngraving(name)
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
        __getEngraving() {
            const group =
                Object.keys(this.fontData).length > 0 ? Object.keys(this.fontData)[0] : null;
            return group ? this.fontData[group] : "";
        },
        __getViewport(group) {
            const alias = this.$store.state.config.initials.$alias;
            const position = this.positionData[group] || "";
            const personalizationAlias = [];

            // gets viewports related to positions
            personalizationAlias.push.apply(personalizationAlias, alias[`step::personalization:${position}`]);
            personalizationAlias.push.apply(personalizationAlias, alias["step::personalization"]);

            if (personalizationAlias.length === 0) return "";
            return personalizationAlias.map(viewport => viewport.split("::")[1])[0];
        },
        __buildEngraving(group) {
            if (this.styleData[group]) {
                return `${this.styleData[group]}:style`;
            }
            if (this.fontData[group]) {
                return `${this.fontData[group]}:font`;
            }
            return "";
        }
    }
};

export default Reference;
</script>
