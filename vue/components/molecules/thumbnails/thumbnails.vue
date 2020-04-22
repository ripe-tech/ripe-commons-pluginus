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
            return this.$store.getters.thumbnails;
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
