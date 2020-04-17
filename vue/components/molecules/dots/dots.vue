<template>
    <div class="dots thumbnails" ref="thumbnailsContainer">
        <dot-thumbnail
            v-bind:frame="`${thumbnail.face}-${thumbnail.frame}`"
            v-bind:name="thumbnail.name"
            v-for="thumbnail in thumbnails"
            v-bind:key="thumbnailKey(thumbnail)"
        />
    </div>
</template>

<script>
export const Dots = {
    name: "dots",
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

export default Dots;
</script>
