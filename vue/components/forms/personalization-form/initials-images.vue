<template>
    <div class="initials-images">
        <img
            v-bind:data-group="group"
            class="image initials-image"
            v-bind:style="style"
            v-bind:class="groupClasses(group)"
            v-for="(group, index) in groups"
            v-show="groupVisible(group)"
            v-bind:key="groupKey(group)"
            ref="initialsImages"
            v-on:click="() => onClick(group)"
            v-on:load="() => onLoaded(group, index)"
        />
    </div>
</template>

<style scoped>
.initials-image {
    font-size: 0px;
}

.initials-images .initials-image {
    height: 600px;
    user-select: none;
    width: auto;
}

.initials-images .initials-image.clickable {
    cursor: pointer;
}

body.mobile .initials-images .initials-image,
body.tablet .initials-images .initials-image {
    height: auto;
    max-width: 600px;
    width: 100%;
}

.initials-images .initials-image.selectable {
    cursor: pointer;
}

.initials-images .initials-image:not([src]) {
    visibility: hidden;
}
</style>

<script>
export const InitialsImages = {
    name: "initials-images",
    props: {
        /**
         * The groups that are going to be displayed as part
         * of this initials images context.
         */
        groups: {
            type: Array,
            default: () => []
        },
        /**
         * The name of the group that is considered to be the active
         * one for the current context.
         */
        activeGroup: {
            type: String,
            default: null
        },
        /**
         * If the images associated with the groups that are
         * currently "inactive" should be hidden from the
         * viewport instead of "just" being marked as not active.
         */
        hideInactive: {
            type: Boolean,
            default: false
        },
        /**
         * A function that receives the initials and engraving as strings
         * and the img element that will be used and returns a map with
         * the initials and a profile list.
         */
        initialsBuilder: {
            type: Function,
            default: null
        },
        /**
         * The context to be used to display the image.
         */
        context: {
            type: Array,
            default: () => ["step::personalization"]
        },
        /**
         * The viewport name to be used to showcase the initials.
         */
        viewport: {
            type: String,
            default: null
        },
        /**
         * The function that gets the context to be used to display
         * the image, in case the context is dynamic.
         */
        getContext: {
            type: Function,
            default: null
        },
        /**
         * The frame to be shown in the images.
         */
        frame: {
            type: String,
            default: null
        },
        /**
         * The max height of each image.
         */
        imageHeight: {
            type: Number,
            default: null
        },
        /**
         * The border radius of each image.
         */
        imageBorderRadius: {
            type: String,
            default: null
        },
        /**
         * The width of each image.
         */
        width: {
            type: Number,
            default: null
        },
        /**
         * The height of each image.
         */
        height: {
            type: Number,
            default: null
        },
        /**
         * If enabled uses pixel ratio in image.
         */
        usePixelRatio: {
            type: Boolean,
            default: false
        },
        /**
         * The object fit CSS option of each image.
         */
        imageObjectFit: {
            type: String,
            default: null
        },
        /**
         * If enabled, opens the image src in a new tab.
         */
        openExternally: {
            type: Boolean,
            default: null
        }
    },
    data: function() {
        return {
            srcs: {},
            initialsImages: []
        };
    },
    watch: {
        async groups(value) {
            await this.unbindImages();
            await this.bindImages();
        },
        async initialsBuilder(value) {
            await this.unbindImages();
            await this.bindImages();
        },
        async context(value) {
            await Promise.all([
                this.initialsImages.map(image => image.updateOptions({ initialsContext: value }))
            ]);
        },
        async frame(value) {
            this.srcs = {};
            await Promise.all([
                this.initialsImages.map(image => image.updateOptions({ frame: value }))
            ]);
        },
        async width(value) {
            await Promise.all([
                this.initialsImages.map(image => image.updateOptions({ width: parseInt(value) }))
            ]);
        },
        async height(value) {
            await Promise.all([
                this.initialsImages.map(image => image.updateOptions({ height: parseInt(value) }))
            ]);
        }
    },
    mounted: async function() {
        await this.bindImages();
    },
    destroyed: async function() {
        await this.unbindImages();
    },
    computed: {
        style() {
            const base = {};
            if (this.height) base.height = `${this.height}px`;
            if (this.width) base.width = `${this.width}px`;
            if (this.imageHeight) base["max-height"] = `${this.imageHeight}px`;
            if (this.imageBorderRadius) base["border-radius"] = `${this.imageBorderRadius}`;
            if (this.imageObjectFit) base["object-fit"] = this.imageObjectFit;
            return base;
        },
        openExternallyFeature() {
            const features = this.$store.state.features || {};
            if (this.openExternally !== null) return this.openExternally;
            if (features["open-externally"] !== undefined) return features["open-externally"];
            return false;
        }
    },
    methods: {
        async bindImages(update = true) {
            this.loaded = {};
            this.initialsImages = [];
            const initialsImages = this.$refs.initialsImages || [];
            for (const initialsImage of initialsImages) {
                const image = this.$ripe.bindImage(initialsImage, {
                    showInitials: true,
                    initialsGroup: initialsImage.dataset.group,
                    initialsBuilder: this.initialsBuilder,
                    initialsContext: this.context,
                    initialsViewport: this.viewport,
                    getInitialsContext: this.getContext,
                    frame: this.frame,
                    width: parseInt(this.width),
                    height: parseInt(this.height),
                    usePixelRatio: this.usePixelRatio
                });
                this.initialsImages.push(image);
            }
            if (update) await this.$ripe.update();
        },
        async unbindImages(update = false) {
            const result = await Promise.all(
                this.initialsImages.map(async image => this.$ripe.unbindImage(image))
            );
            if (update) await this.$ripe.update();
            return result;
        },
        groupKey(group) {
            return [this.brand, this.model, group].join(":");
        },
        groupVisible(group) {
            if (!this.hideInactive) return true;
            return group === this.activeGroup;
        },
        groupClasses(group) {
            const base = {
                active: group === this.activeGroup,
                selectable: this.groups.length > 1,
                loaded: Boolean(this.srcs[group]),
                clickable: this.openExternallyFeature
            };
            return base;
        },
        onClick(group) {
            if (this.openExternallyFeature) {
                const src = this.srcs[group];
                window.open(src, "_blank");
            }
            this.$emit("image-selected", group);
        },
        onLoaded(group, index) {
            const initialsImages = Array.isArray(this.$refs.initialsImages)
                ? this.$refs.initialsImages
                : [this.$refs.initialsImages];
            const src = initialsImages[index].src;
            this.$set(this.srcs, group, src);

            // verifies if all images were loaded and if
            // so sends an event
            if (!this.groups.every(group => Object.keys(this.srcs).includes(group))) return;

            // incase the frame that was loaded is not longer the
            // latest one ignores the load operation, retuning the
            // control flow immediately
            const queryParams = this.$ripe._unpackQuery(src);
            if (this.frame && queryParams.frame !== this.frame) return;

            // triggers the load images operation indicating that
            // all of the images for the current configuration
            // have been loaded
            this.$emit("load:images");
        }
    }
};

export default InitialsImages;
</script>
