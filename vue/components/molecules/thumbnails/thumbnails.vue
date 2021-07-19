<template>
    <div class="thumbnails" ref="thumbnailsContainer">
        <thumbnail
            v-bind:frame="thumbnailFrame(thumbnail)"
            v-bind:name="thumbnail.name"
            v-bind:size="thumbnail.size || size"
            v-bind:crop="thumbnail.crop || crop"
            v-bind:bind-image-options="thumbnail.bindImageOptions"
            v-for="thumbnail in _thumbnails"
            v-bind:key="thumbnailKey(thumbnail)"
        />
    </div>
</template>

<script>
export const Thumbnails = {
    name: "thumbnails",
    props: {
        thumbnails: {
            type: Array,
            default: null
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
    computed: {
        _thumbnails() {
            if (this.thumbnails) return this.thumbnails;

            // filters the invalid thumbnails from the thumbnails list
            // a thumbnail is considered invalid if the associated frame
            // is not part of the base frames definition of the model
            return this.$store.getters.thumbnails.filter(
                t =>
                    this.$store.state.config.faces &&
                    this.$store.state.config.faces_m &&
                    this.$store.state.config.faces.includes(t.face) &&
                    this.$store.state.config.faces_m[t.face] &&
                    t.frame < this.$store.state.config.faces_m[t.face].frames
            );
        }
    },
    methods: {
        thumbnailFrame(thumbnail) {
            return thumbnail.face && thumbnail.frame ? `${thumbnail.face}-${thumbnail.frame}` : thumbnail.frame;
        },
        thumbnailKey(thumbnail) {
            return `${thumbnail.frame}:${thumbnail.name}:${thumbnail.face}`;
        }
    }
};

export default Thumbnails;
</script>
