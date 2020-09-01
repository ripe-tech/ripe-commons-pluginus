<template>
    <div class="initials-images">
        <img
            v-bind:data-group="group"
            class="image initials-image"
            v-bind:class="{ active: group === activeGroup }"
            v-for="group in groups"
            v-bind:key="groupKey(group)"
            ref="initialsImages"
            v-on:click="() => imageSelected(group)"
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
export const InitialsImages = {
    name: "initials-images",
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
    watch: {
        async groups(value) {
            await this.unbindImages();
            await this.bindImages();
        }
    },
    mounted: async function() {
        await this.bindImages();
    },
    destroyed: async function() {
        await this.unbindImages();
    },
    methods: {
        groupKey(group) {
            return [this.brand, this.model, group].join(":");
        },
        imageSelected(group) {
            this.$emit("image-selected", group);
        },
        async bindImages(update = true) {
            this.initialsImages = [];
            const initialsImages = this.$refs.initialsImages || [];
            for (const initialsImage of initialsImages) {
                const image = this.$ripe.bindImage(initialsImage, {
                    showInitials: true,
                    initialsGroup: initialsImage.dataset.group,
                    initialsBuilder: this.initialsBuilder
                });
                this.initialsImages.push(image);
            }
            await this.$ripe.update();
        },
        async unbindImages() {
            const result = await Promise.all(
                this.initialsImages.map(async image => this.$ripe.unbindImage(image))
            );
            return result;
        }
    }
};

export default InitialsImages;
</script>
