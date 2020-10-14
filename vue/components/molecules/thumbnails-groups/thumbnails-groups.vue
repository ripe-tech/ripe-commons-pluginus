<template>
    <initials-images
        class="thumbnails thumbnails-groups"
        v-bind:brand="brand"
        v-bind:model="model"
        v-bind:active-group="activeGroup"
        v-bind:groups="groups"
        v-bind:initials-builder="__initialsBuilder"
        v-bind:context-getter="__getContext"
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
import { logicMixin } from "../../../mixins";

export const ThumbnailsGroups = {
    name: "thumbnails-groups",
    mixins: [logicMixin],
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
        }
    }
};

export default ThumbnailsGroups;
</script>
