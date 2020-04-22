<template>
    <img
        class="thumbnail"
        v-bind:class="{ active: active, loaded: loaded }"
        v-bind:alt="name"
        src=""
        ref="image"
        v-on:click="showFrame"
        v-on:load="onLoaded"
    />
</template>

<style scoped>
.thumbnail {
    border: 1px solid #cccccc;
    cursor: pointer;
    display: block;
    height: 70px;
    margin-top: 10px;
    opacity: 0;
    -webkit-transition: opacity 0.3s;
    -moz-transition: opacity 0.3s;
    -ms-transition: opacity 0.3s;
    -o-transition: opacity 0.3s;
    transition: opacity 0.3s;
    width: 70px;
}

.thumbnail.loaded {
    opacity: 0.7;
}

body.desktop .thumbnail:first-child {
    margin-left: 0px;
    margin-top: 0px;
}

.thumbnail:hover {
    opacity: 1;
}

.thumbnail.active {
    border-color: #000000;
    opacity: 1;
}

body.tablet .thumbnail,
body.mobile .thumbnail {
    display: inline-block;
    height: 50px;
    margin: 0px auto 0px 7px;
    width: 50px;
}

body.tablet .thumbnail:first-child,
body.mobile .thumbnail:first-child {
    margin-left: 0px;
    margin-top: 0px;
}
</style>

<script>
export const Thumbnail = {
    name: "thumbnail",
    props: {
        frame: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
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
    data: function() {
        return {
            image: null,
            loaded: false
        };
    },
    computed: {
        active() {
            return this.frame === this.$store.state.currentFrame;
        }
    },
    methods: {
        showFrame() {
            this.$bus.trigger("show_frame", this.frame);
        },
        onLoaded() {
            this.loaded = true;
        }
    },
    mounted: function() {
        this.image = this.$ripe.bindImage(this.$refs.image, {
            frame: this.frame,
            size: this.size || undefined,
            crop: this.crop || undefined
        });
    },
    destroyed: function() {
        this.image && this.$ripe.unbindImage(this.image);
        this.image = null;
    }
};

export default Thumbnail;
</script>
