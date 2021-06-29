<template>
    <div class="initials-images">
        <img
            v-bind:data-group="group"
            class="image initials-image"
            v-bind:style="style()"
            v-bind:class="groupClasses(group)"
            v-for="group in groups"
            v-show="groupVisible(group)"
            v-bind:key="groupKey(group)"
            ref="initialsImages"
            v-on:click="() => onClick(group)"
            v-on:load="() => onLoaded(group)"
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

body.mobile .initials-images .initials-image,
body.tablet .initials-images .initials-image {
    height: auto;
    width: 100%;
}

.initials-images .initials-image.selectable {
    cursor: pointer;
}
</style>

<script>
import { partMixin } from "../../../mixins";

export const InitialsImages = {
    mixins: [partMixin],
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
        /**
         * If the images associated with the groups that are
         * currently "inactive" should be hidden from the
         * viewport instead of "just" being marked as not active.
         */
        hideInactive: {
            type: Boolean,
            default: false
        },
        initialsBuilder: {
            type: Function,
            default: null
        },
        context: {
            type: Array,
            default: () => ["step::personalization"]
        },
        viewport: {
            type: String,
            default: null
        },
        getContext: {
            type: Function,
            default: null
        },
        imageHeight: {
            type: Number,
            default: null
        },
        imageBorderRadius: {
            type: String,
            default: null
        },
        height: {
            type: Number,
            default: null
        },
        maxWidth: {
            type: Number,
            default: 600
        },
        maxWidthMobile: {
            type: Number,
            default: 600
        }
    },
    data: function() {
        return {
            loaded: {},
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
            this.initialsImages.forEach(image => image.updateOptions({ initialsContext: value }));
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
            if (this.imageHeight) base["max-height"] = `${this.imageHeight}px`;
            if (this.imageBorderRadius) base["border-radius"] = `${this.imageBorderRadius}`;
            if (this.maxWidth && this.isDesktopWidth()) base["max-width"] = this.maxWidth;
            if (this.maxWidthMobile && !this.isDesktopWidth()) base["max-width"] = this.maxWidthMobile;
            return base;
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
                    getInitialsContext: this.getContext
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
                loaded: this.loaded[group]
            };
            return base;
        },
        onClick(group) {
            this.$emit("image-selected", group);
        },
        onLoaded(group) {
            this.$set(this.loaded, group, true);
        }
    }
};

export default InitialsImages;
</script>
