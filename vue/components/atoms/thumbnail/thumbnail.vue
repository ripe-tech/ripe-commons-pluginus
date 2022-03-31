<template>
    <img
        class="thumbnail"
        v-bind:class="classes"
        v-bind:alt="name"
        src=""
        ref="image"
        v-on:click="showFrame"
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

.thumbnail.hidden {
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
import { frameMixin } from "../../../mixins";

export const Thumbnail = {
    name: "thumbnail",
    mixins: [frameMixin],
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
            hidden: false
        };
    },
    computed: {
        active() {
            return this.frame === this.$store.state.currentFrame;
        },
        classes() {
            const base = {
                active: this.active,
                loaded: this.loaded,
                hidden: this.hidden
            };
            return base;
        }
    },
    mounted: function() {
        // build the required provider for the frame, if the thumbnail corresponds to a video
        // the URL provider, frame validator and frame differs, as well as the 'doubleBuffering'
        // usage, since the video for certain customizations might not exist
        const bindMethod = this.isVideoFrame(this.frame)
            ? (...args) => this.$ripe.bindVideoThumbnail(...args)
            : (...args) => this.$ripe.bindImage(...args);

        this.image = bindMethod(this.$refs.image, {
            frame: this.getFrame(this.frame),
            initialsGroup: this.initialsGroup(this.frame),
            initialsContext: this.initialsContext(this.frame),
            showInitials: this.isPersonalizationFrame(this.frame),
            size: this.size || undefined,
            crop: this.crop || undefined
        });
        this.image.bind("loaded", () => this.onLoaded());
        this.image.bind("error", () => this.onError());
    },
    destroyed: async function() {
        if (this.image) await this.$ripe.unbindImage(this.image);
        this.image = null;
    },
    methods: {
        showFrame() {
            this.$bus.trigger("show_frame", this.frame);
        },
        getFrame(frame) {
            return this.getOnlyFrame(frame);
        },
        initialsGroup(frame) {
            return this.getGroupPersonalization(frame);
        },
        initialsContext(frame) {
            if (!this.isPersonalizationFrame(frame)) return;
            return ["step::personalization"];
        },
        onLoaded() {
            this.loaded = true;
            this.hidden = false;
        },
        onError() {
            this.hidden = true;
        }
    }
};

export default Thumbnail;
</script>
