<template>
    <div class="initials-images">
        <img
            v-bind:data-group="group"
            class="image initials-image"
            v-bind:class="{ active: group === activeGroup }"
            v-for="group in groups"
            v-bind:key="groupKey(group)"
            ref="initialsImages"
            v-on:click="imageSelected(group)"
        />
    </div>
</template>

<style scoped>
.initials-image {
    font-size: 0px;
}

.initials-images .initials-image {
    cursor: pointer;
    height: 600px;
    width: auto;
}

body.mobile .initials-images .initials-image,
body.tablet .initials-images .initials-image {
    height: auto;
    max-width: 600px;
    width: 100%;
}
</style>

<script>
export const initialsImages = {
    props: {
        groups: {
            type: Array,
            default: () => []
        },
        activeGroup: {
            type: String,
            default: null
        },
        initialsBuilder: {
            type: Function,
            default: null
        }
    },
    data: function() {
        return {
            initialsImages: []
        };
    },
    mounted: function() {
        const initialsImages = this.$refs.initialsImages || [];
        for (const initialsImage of initialsImages) {
            const image = this.$ripe.bindImage(initialsImage, {
                showInitials: true,
                initialsBuilder: this.initialsBuilder
            });
            this.initialsImages.push(image);
        }
    },
    destroyed: function() {
        this.initialsImages.forEach(image => this.$ripe.unbindImage(image));
    },
    methods: {
        groupKey(group) {
            return [this.brand, this.model, group].join(":");
        },
        imageSelected(group) {
            this.$emit("image-selected", group);
        }
    }
};

export default initialsImages;
</script>
