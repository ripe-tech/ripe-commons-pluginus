<template>
    <div class="thumbnails" ref="thumbnailsContainer">
        <thumbnail
            v-bind:frame="`${thumbnail.face}-${thumbnail.frame}`"
            v-bind:name="thumbnail.name"
            v-bind:size="size"
            v-bind:crop="crop"
            v-for="thumbnail in thumbnails"
            v-bind:key="thumbnailKey(thumbnail)"
        />
    </div>
</template>

<script>
export const Thumbnails = {
    name: "thumbnails",
    props: {
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
        thumbnails() {
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
        thumbnailKey(thumbnail) {
            return `${thumbnail.frame}:${thumbnail.name}:${thumbnail.face}`;
        }
    }
};

export default Thumbnails;
</script>
