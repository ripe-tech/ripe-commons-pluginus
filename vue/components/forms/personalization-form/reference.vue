<template>
    <div class="generic-personalization">
        <initials-images
            v-bind:brand="brand"
            v-bind:model="model"
            v-bind:groups="groups"
            v-bind:active-group="activeGroup"
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
                        v-bind:value.sync="initialsData[group]"
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
            initialsData: {},
            activeGroup: "",
            groups: [],
            initials: {},
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
        profile() {
            const profileUsed = this.$store.state.config.initials.profile;
            return this.$store.state.config.initials.$profiles[profileUsed];
        },
        state() {
            return this.groups.length > 1
                ? {
                      initialsExtra: this.__getInitials()
                  }
                : {
                      initials: this.initialsData[this.groups[0]]
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
            return this.setState({
                initials: {}
            });
        },
        setState(state) {
            const initials = {};
            const initialsExtra = state.initialsExtra || {};
            for (const name of this.groups) {
                const group = initialsExtra[name] || {};
                const engraving = group.engraving || this.fontEngraving;
                initials[name] = {
                    initials: group.initials || "",
                    engraving: engraving
                };
                this.style = engraving;
            }
            this.initials = initials;
        },
        getState() {
            return this.state;
        },
        getTabMessage() {},
        async getGroups() {
            this.groups = await this.$ripe.getLogicP({
                brand: this.$store.state.brand,
                model: this.$store.state.model,
                method: "groups"
            });
            if (this.groups && this.groups.length > 0) this.activeGroup = this.groups[0];
        },
        __initialsBuilder(initials, engraving, element) {
            if (this.groups.length > 1) {
                const group = element.getAttribute("data-group");
                const viewport = "large";
                const profiles = [];

                if (this.fontData[group]) {
                    profiles.push(this.font + ":" + group, this.font + ":" + viewport);
                }

                profiles.push(group + ":" + viewport);

                if (this.fontData[group]) {
                    profiles.push(this.font);
                }

                profiles.push(group, viewport);

                return {
                    initials: initials,
                    profile: profiles
                };
            }

            const profiles = [];
            profiles.push(engraving);

            return {
                initials: initials,
                profile: profiles
            };
        },
        __getInitials() {
            const _initials = {};
            for (const name in this.initialsData) {
                const group = {
                    initials: this.initialsData[name],
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
