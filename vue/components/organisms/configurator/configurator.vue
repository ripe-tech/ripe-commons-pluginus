<template>
    <div class="configurator-container">
        <div class="loader-container" v-if="loading">
            <slot name="loader" v-if="loading">
                <loader class="loader" v-bind:loader="'ball-scale-multiple'" />
            </slot>
        </div>
        <div
            class="configurator-wrapper"
            v-bind:class="{ loading: loading, 'loading-error': Boolean(loadingError) }"
        >
            <div class="config" ref="configurator" />
            <div class="error" v-if="modelError && !loadingError">
                Error loading model {{ model }} from brand {{ brand }}<br />
                {{ errorMessage ? errorMessage : "" }}
            </div>
            <div class="holder" v-bind:class="{ disappear: hideHolder }">
                <div class="holder-label">
                    {{ "ripe_commons.holder.holder.label" | locale }}
                </div>
                <img class="holder-image" src="~./assets/drag.svg" />
                <div class="holder-second-label">
                    {{ "ripe_commons.holder.holder-second-label.label" | locale }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.configurator-wrapper {
    position: relative;
    text-align: center;
    transition: opacity 0.125s ease-in;
}

.configurator-wrapper.loading {
    opacity: 0;
}

.configurator-wrapper .configurator {
    cursor: grab;
}

.configurator-wrapper .configurator[data-frames="1"] {
    cursor: default;
}

.configurator-wrapper .configurator.drag {
    cursor: grabbing;
}

.configurator-wrapper .configurator.drag[data-frames="1"] {
    cursor: default;
}

.configurator-wrapper .configurator.highlight {
    cursor: pointer;
}

.configurator-wrapper .configurator.loading,
.configurator-wrapper .configurator.preloading,
.configurator-wrapper .configurator:not(.ready) {
    cursor: progress;
}

.configurator-wrapper.loading-error .configurator {
    cursor: default;
}

.loader-container > * {
    left: calc(50%);
    position: absolute;
    top: calc(50%);
}

.holder {
    bottom: 5px;
    pointer-events: none;
    position: absolute;
    width: 100%;
}

.holder.disappear {
    opacity: 0;
    transition: opacity 1s ease;
}

.holder-image {
    height: 77px;
    max-width: 100%;
}

.holder-second-label {
    color: #afafaf;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.holder-label {
    color: #afafaf;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    margin-bottom: -55px;
    text-transform: uppercase;
}
</style>

<script>
import { ripe } from "ripe-sdk";

/**
 * The component that contains the RIPE SDK's configurator, responsible
 * for forwarding its events to the Vue bus, as well the other way
 * around.
 */
export const Configurator = {
    name: "configurator",
    props: {
        ripe: {
            type: Object,
            default: null
        },
        ignoreBus: {
            type: Boolean,
            default: false
        },
        options: {
            type: Object,
            default: function() {
                return {
                    duration: 250,
                    configAnimate: false
                };
            }
        },
        /**
         * The name of the frame to be shown in the configurator using
         * the normalized frame format (eg: side-1).
         */
        frame: {
            type: String,
            default: null
        },
        size: {
            type: Number,
            default: null
        },
        /**
         * The time accepted for the holder to appear on the display
         * without any interaction of the user.
         */
        timeoutHolder: {
            type: Number,
            default: 7500
        },
        useMasks: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        elementDisplayed() {
            if (!this.configurator) {
                return false;
            }
            return getComputedStyle(this.configurator.element).display !== "none";
        },
        hideHolder() {
            return this.singleFrameView || this.frameChanged || this.holderTimedOut;
        },
        mergedOptions() {
            return { ...this.options, useMasks: this.useMasks };
        }
    },
    data: function() {
        return {
            /**
             * Ripe instance used by the configurator. Defaults to the
             * global ripe instance when the prop ripe isn't set.
             */
            ripeInstance: this.ripe ? this.ripe : this.$ripe,
            /**
             * The frame that is currently being shown in the
             * configurator.
             */
            frameData: this.frame,
            /**
             * Flag that controls if the initial loading process for
             * the modal in the configurator is still running.
             */
            loading: false,
            /**
             * The reference to the possible loading error instance
             * triggered withing an malfunctioning configurator loading.
             */
            loadingError: null,
            /**
             * If the current view is a single frame one, meaning that
             * no "rotation" should be "applied" to it.
             */
            singleFrameView: true,
            /**
             * Listener flag that represents if a rotation have been made.
             */
            frameChanged: false,
            /**
             * Indicates whether the time accepted for the
             * holder to appear on the display has "timed-out".
             */
            holderTimedOut: false
        };
    },
    mounted: function() {
        this.loading = true;

        setTimeout(() => {
            this.holderTimedOut = true;
        }, this.timeoutHolder);

        this.configurator = this.ripeInstance.bindConfigurator(
            this.$refs.configurator,
            this.mergedOptions
        );

        this.configurator.bind("changed_frame", frame => {
            // sets the frame changed flag and then updates
            // the frame key to the new one (internal copy)
            this.frameChanged = true;
            this.frameData = frame;

            // updates the value of the single frame view
            // variable as the new view may have several frames
            // or just one and the variable value may change
            this.singleFrameView = (this.configurator.frames[this.configurator.view] || 1) === 1;

            // only the visible instance of this component
            // should be sending events it's considered to
            // be the main/master one
            if (this.elementDisplayed) {
                this.$store.commit("current_frame", frame);
                this.$bus.trigger("changed_frame", this.configurator, frame);
            }
        });

        this.configurator.bind("loaded", () => {
            const frame = `${this.configurator.view}-${this.configurator.position}`;
            this.frameData = frame;
            this.loading = false;
            this.singleFrameView = (this.configurator.frames[this.configurator.view] || 1) === 1;
            this.$store.commit("current_frame", frame);
        });

        this.configurator.bind("highlighted_part", part => {
            this.$bus.trigger("highlighted_part", this.configurator, part);
        });

        this.configurator.bind("lowlighted", () => {
            this.$bus.trigger("lowlighted", this.configurator);
        });

        this.$bus.bind("error", error => {
            if (this.ignoreBus) return;
            if (!this.loading) return;

            this.loading = false;
            this.loadingError = error;
        });

        this.$bus.bind("pre_config", () => {
            if (this.ignoreBus) return;

            this.loading = true;
        });

        this.$bus.bind("changed_frame", (configurator, frame) => {
            // in case the global bus should be ignore nothing is
            // done as a consequence of a changed frame
            if (this.ignoreBus) return;

            // avoid infinite loop, by checking if the frame
            // is the one we're currently on
            if (this.frameData === frame) return;

            // in case the configurator is not currently ready
            // then avoids the operation (returns control flow)
            if (!this.configurator || !this.configurator.ready) {
                return;
            }

            this.configurator.changeFrame(frame, {
                type: null,
                duration: null
            });
        });

        this.$bus.bind("show_frame", frame => {
            if (this.ignoreBus) return;
            this.frameData = frame;
        });

        this.$bus.bind("highlight_part", part => {
            if (this.ignoreBus) return;
            this.configurator.ready && this.configurator.highlight(part);
        });

        this.$bus.bind("lowlight_part", part => {
            if (this.ignoreBus) return;

            this.configurator.ready && this.configurator.lowlight(part);
        });

        this.resize(this.size);
    },
    watch: {
        frame(value) {
            if (this.frameData === value) return;
            this.frameData = value;
        },
        async frameData(value, previous) {
            // in case the configurator is not currently ready
            // then avoids the operation (returns control flow)
            if (!this.configurator || !this.configurator.ready) return;

            // extracts the view part of both the previous and the
            // current frame to be used for change view comparison
            const previousView = previous ? ripe.parseFrameKey(previous)[0] : "";
            const view = ripe.parseFrameKey(value)[0];

            // runs the frame changing operation (possible animation)
            // according to the newly changed frame value
            await this.configurator.changeFrame(value, {
                type: view === previousView ? false : this.animation,
                revolutionDuration: view === previousView ? this.duration : null,
                duration: this.duration
            });

            // triggers the update frame event allow bi-directional
            // binding of the prop value frame
            this.$emit("update:frame", value);
        },
        size(size) {
            this.resize(size);
        },
        useMasks() {
            if (!this.configurator) return;
            if (this.useMasks) this.configurator.enableMasks();
            else this.configurator.disableMasks();
        },
        loading(value) {
            this.$emit("update:loading", value);
        }
    },
    methods: {
        /**
         * Re-sizes the configurator according to the current
         * available container size (defined by parent).
         */
        resize(size) {
            if (!size || !this.configurator) return;
            this.configurator.resize(size);
        }
    },
    destroyed: async function() {
        if (this.configurator) await this.ripeInstance.unbindConfigurator(this.configurator);
        this.configurator = null;
    }
};

export default Configurator;
</script>
