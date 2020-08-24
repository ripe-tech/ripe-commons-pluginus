<template>
    <initials-images
        class="thumbnails thumbnails-groups"
        v-bind:brand="brand"
        v-bind:model="model"
        v-bind:active-group="activeGroup"
        v-bind:groups="groups"
        v-bind:initials-builder="__initialsBuilder"
        ref="thumbnailsContainer"
        v-on:image-selected="onImageSelected"
    />
</template>

<style lang="scss" scoped>
.thumbnails.thumbnails-groups ::v-deep .initials-image {
    display: block;
    height: initial;
}
</style>

<script>
export const ThumbnailsGroups = {
    name: "thumbnails-groups",
    props: {
        activeGroup: {
            type: String,
            required: true
        },
        groups: {
            type: Array,
            required: true
        },
        size: {
            type: Number,
            default: null
        },
        crop: {
            type: Boolean,
            default: null
        }
    },
    data: function() {
        return {
            activeGroupData: this.activeGroup
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
        }
    },
    watch: {
        activeGroup(value) {
            this.activeGroupData = value;
        },
        activeGroupData(value) {
            this.$emit("update:active-group", value);
        }
    },
    methods: {
        onImageSelected(group) {
            this.activeGroupData = group;
        },
        __initialsBuilder(initials, engraving, element) {
            const group = element.getAttribute("data-group");
            const properties = engraving
                ? this.$ripe.parseEngraving(engraving, this.configInitials.properties).valuesM
                : {};
            const profiles = this.__getPersonalizationProfiles(group, properties);

            Object.entries(properties).forEach(([type, value]) => {
                this.groups.length > 1 && profiles.push(value + ":" + group);
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
        }
    }
};

export default ThumbnailsGroups;
</script>
