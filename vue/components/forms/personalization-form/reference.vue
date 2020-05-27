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
                        v-bind:value.sync="initialsTextData[group]"
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
    max-height: 300px;
    margin-right: 30px;
}

.generic-personalization > .initials-images ::v-deep .initials-image:last-of-type {
    margin-right: 0px;
}

.generic-personalization > .form {
    display: flex;
    justify-content: center;
}

.generic-personalization > .form > .form-group {
    width: 100%;
    margin-right: 30px;
}

.generic-personalization > .form > .form-group:last-of-type {
    margin-right: 0px;
}

.generic-personalization > .form > .form-group > .subtitle {
    text-transform: capitalize;
    margin-top: 10px;
}

.generic-personalization > .form > .form-group > .form-input {
    text-align: left;
    margin-bottom: 20px;
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
            initialsTextData: {},
            activeGroup: "",
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
            return this.groups.length > 1
                ? { initialsExtra: this.__getInitialsExtra(), engraving: this.fontEngraving } // TODO: not sure if engraving is needed here
                : this.__getInitials();
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
            this.fontData = {};
            this.styleData = {};
            this.initialsTextData = {};
            this.fontEngraving = "";

            return this.setState({});
        },
        setState(state) {
            // TODO: support for both initials and initialsExtra
            // TODO: Weird behaviour is happening in one group builds =>
            // the initials_extra param in URL appears with a part null,
            // not similar to dummy build behaviour
            const initialsExtra = state.initialsExtra || {};
            for (const name of this.groups) {
                const group = initialsExtra[name] || {};
                const engraving = group.engraving || this.fontEngraving;

                this.initialsTextData[name] = group.initials || "";
                this.fontData[name] = engraving.split(":")[0];
            }
        },
        getState() {
            return this.state;
        },
        getTabMessage() {
            const initials = [];
            const engravings = [];
            for (const name in this.initialsTextData) {
                const initialsText = this.initialsTextData[name];
                if (!initialsText) continue;
                initials.push(initialsText);

                const engraving = this.locale(
                    "properties.font." + this.fontData[name].split(":")[0],
                    this.readable(this.capitalize(this.fontData[name]))
                );
                engravings.push(engraving);
            }
            return initials.length > 0 ? initials.join(" ") + " " + engravings.join(" ") : "";
        },
        async getGroups() {
            this.groups = await this.$ripe.getLogicP({
                brand: this.$store.state.brand,
                model: this.$store.state.model,
                method: "groups"
            });
        },
        __initialsBuilder(initials, engraving, element) {
            const group = element.getAttribute("data-group");
            const viewport = "large";
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
            if (Object.keys(this.initialsTextData).length === 0) {
                return { initials: "", engraving: "" };
            }

            const mainGroup = Object.keys(this.initialsTextData)[0];
            return {
                initials: this.initialsTextData[mainGroup],
                engraving: this.__buildEngraving(mainGroup)
            };
        },
        __getInitialsExtra() {
            const _initials = {};
            for (const name in this.initialsTextData) {
                const group = {
                    initials: this.initialsTextData[name],
                    engraving: this.__buildEngraving(name)
                };
                _initials[name] = group;
            }
            return _initials;
        },
        __buildEngraving(group) {
            if (this.styleData[group]) {
                this.fontEngraving = `${this.styleData[group]}:style`;
            }
            if (this.fontData[group]) {
                this.fontEngraving = `${this.fontData[group]}:font`;
            }
            return this.fontEngraving;
        }
    }
};

export default Reference;
</script>
