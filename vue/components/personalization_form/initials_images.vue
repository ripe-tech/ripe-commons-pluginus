<template>
    <div class="initials-images">
        <img
            v-bind:data-group="group"
            class="image initials-image"
            v-bind:class="{ active: group == activeGroup }"
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
    height: 600px;
    width: auto;
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
        for (let initialsImage of initialsImages) {
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
