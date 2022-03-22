<template>
    <img
        class="thumbnail"
        v-bind:class="{ active: active, loaded: loaded, hide: hide }"
        v-bind:alt="name"
        src=""
        ref="image"
        v-on:click="showFrame"
        v-on:load="onLoaded"
        v-on:error="onError"
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

.thumbnail.hide {
    display: none;
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
    height: auto;
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
            loaded: false,
            hide: false
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
        setVideo() {
            if (!this.frame.startsWith("video")) return;

            const videoThumbnailURL = this.$ripe._getVideoThumbnailURL({
                name: this.frame.split("video-")[1]
            });
            this.$refs.image.src = videoThumbnailURL;
        },
        onLoaded() {
            this.loaded = true;
            this.hide = false;
        },
        onError() {
            this.hide = true;
        }
    },
    mounted: function() {
        this.$bus.bind("parts", () => this.setVideo());

        // if the frame is for a video, retrieves the video thumbnail
        // url and sets it as the image's 'src'
        if (this.frame.startsWith("video")) {
            this.setVideo();
            return;
        }
        this.image = this.$ripe.bindImage(this.$refs.image, {
            frame: this.frame,
            size: this.size || undefined,
            crop: this.crop || undefined
        });
    },
    destroyed: async function() {
        if (this.image) await this.$ripe.unbindImage(this.image);
        this.image = null;
    }
};

export default Thumbnail;
</script>
