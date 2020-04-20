<template>
    <div class="dot-container" v-on:click="showFrame">
        <dot v-bind:color="'dark'" v-bind:subtle="!active" v-bind:size="10" />
    </div>
</template>

<style scoped>
.dot-container {
    cursor: pointer;
    display: inline-block;
    padding: 15px 15px 15px 15px;
}
</style>

<script>
export const DotThumbnail = {
    name: "dot-thumbnail",
    props: {
        frame: {
            type: String,
            required: true
        }
    },
    computed: {
        active() {
            return this.frame === this.$store.state.currentFrame;
        }
    },
    methods: {
        showFrame() {
            this.$bus.trigger("show_frame", this.frame);
        }
    }
};

export default DotThumbnail;
</script>
