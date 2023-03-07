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
                    {{ locale("ripe_commons.holder.holder.label") }}
                </div>
                <img class="holder-image" src="~./assets/drag.svg" />
                <div class="holder-second-label">
                    {{ locale("ripe_commons.holder.holder-second-label.label") }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.configurator-wrapper {
    height: 100%;
    position: relative;
    text-align: center;
    transition: opacity 0.125s ease-in;
    width: 100%;
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

.configurator-wrapper ::v-deep .renderer {
    align-items: center;
    display: flex;
    justify-content: center;
}

.configurator-wrapper ::v-deep .renderer:hover {
    cursor: grab;
}

.configurator-wrapper ::v-deep .renderer:active {
    cursor: grabbing;
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
        /**
         * The options that are going to be used to configure the
         * configurator while initializing it.
         */
        options: {
            type: Object,
            default: function() {
                return {
                    animation: "cross",
                    duration: 250,
                    revolutionDuration: 500,
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
        /**
         * The size of the configurator in pixels, this is going to be
         * applied to both the width and height (square format 1:1).
         */
        size: {
            type: Number,
            default: null
        },
        /**
         * The width of the configurator in pixels, that allows support
         * for non-square images.
         */
        width: {
            type: Number,
            default: null
        },
        /**
         * The height of the configurator in pixels, that allows support
         * for non-square images.
         */
        height: {
            type: Number,
            default: null
        },
        /**
         * If enabled shows the holder (drag indicator) under the configurator
         * images during a time interval or until the user interacts with it.
         */
        holder: {
            type: Boolean,
            default: true
        },
        /**
         * The time accepted for the holder to appear on the display
         * without any interaction of the user.
         */
        timeoutHolder: {
            type: Number,
            default: 7500
        },
        /**
         * If the masks should be displayed while hovering the mouse
         * on top of the multiple model parts.
         */
        useMasks: {
            type: Boolean,
            default: undefined
        },
        /**
         * The rendering mode of the configurator.
         * (eg. "prc" or "csr")
         */
        configuratorType: {
            type: String,
            default: undefined
        },
        /**
         * Callback function to be called when a configurator related
         * error is thrown, for some operations (eg: while changing frame).
         */
        onError: {
            type: Function,
            default: error => {
                throw error;
            }
        }
    },
    computed: {
        loadingCsrConfigurator() {
            if (this.configuratorType !== "csr") return false;
            if (!this.ripeInstance.hasStrategy("csr")) return false;
            return this.configurator.loading;
        },
        elementDisplayed() {
            if (!this.configurator) {
                return false;
            }
            return getComputedStyle(this.configurator.element).display !== "none";
        },
        hideHolder() {
            return !this.holder || this.singleFrameView || this.frameChanged || this.holderTimedOut;
        },
        mergedOptions() {
            return {
                ...this.options,
                useMasks: this.useMasks === undefined ? this.options.useMasks : this.useMasks
            };
        }
    },
    data: function() {
        return {
            /**
             * Ripe instance used by the configurator. Defaults to the
             * global Ripe instance when the prop ripe isn't set.
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
        this.bindConfigurator(this.$refs.configurator);

        // in case CSR configurator is stil loading
        // and `post_config` event was missed
        // then re-trigger it
        if (this.loadingCsrConfigurator) {
            this.ripeInstance.trigger("post_config", this.ripeInstance.loadedConfig);
        }

        this.resize(this.size, this.width, this.height);
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

            // calculates the parameters for the frame change taking
            // into account if the view (face) is going to change
            const sameView = view === previousView;
            const type = sameView ? false : this.options.animation;
            const revolutionDuration = sameView ? this.options.revolutionDuration : null;
            const duration = this.options.duration;

            try {
                // runs the frame changing operation (possible animation)
                // according to the newly changed frame value
                await this.configurator.changeFrame(value, {
                    type: type,
                    revolutionDuration: revolutionDuration,
                    duration: duration
                });
            } catch (error) {
                // calls the registered callback handler for the
                // error (default implementation is a simple re-throw)
                this.onError(error);
            }

            // triggers the update frame event allow bi-directional
            // binding of the prop value frame
            this.$emit("update:frame", value);
        },
        size(size) {
            // reacts to the new size by triggering the resize operation
            // in the configurator, to change the viewport accordingly
            this.resize(size);
        },
        width(width) {
            // reacts to the new width by triggering the resize operation
            // in the configurator, to change the viewport accordingly
            this.resize(null, width, this.height);
        },
        height(height) {
            // reacts to the new height by triggering the resize operation
            // in the configurator, to change the viewport accordingly
            this.resize(null, this.width, height);
        },
        useMasks() {
            if (!this.configurator) return;
            if (this.useMasks) this.configurator.enableMasks();
            else this.configurator.disableMasks();
        },
        loading(value) {
            this.$emit("update:loading", value);
        },
        mergedOptions(value) {
            this.configurator.updateOptions(value);
        }
    },
    methods: {
        bindConfigurator(element) {
            this.loading = true;

            setTimeout(() => {
                this.holderTimedOut = true;
            }, this.timeoutHolder);

            this.configurator = this.ripeInstance.bindConfigurator(element, {
                ...this.mergedOptions,
                size: this.size,
                width: this.width,
                height: this.height,
                type: this.configuratorType
            });

            this.bindConfiguratorEvents();
        },
        bindConfiguratorEvents() {
            this.configurator.bind("changed_frame", frame => {
                // sets the frame changed flag only if there was a
                // previous frame set and then updates the frame
                // key to the new one (internal copy)
                this.frameChanged = Boolean(this.frameData);
                this.frameData = frame;

                // updates the value of the single frame view
                // variable as the new view may have several frames
                // or just one and the variable value may change
                this.singleFrameView =
                    (this.configurator.frames[this.configurator.view] || 1) === 1;

                // only the visible instance of this component
                // should be sending events it's considered to
                // be the main/master one
                if (this.elementDisplayed) {
                    this.$store.commit("currentFrame", frame);
                    this.$bus.trigger("changed_frame", this.configurator, frame);
                }
            });

            this.configurator.bind("loaded", () => {
                // updates the current frame in view with the one currently set
                // in the configurator (to be used for data visibility purposes)
                const frame = `${this.configurator.view}-${this.configurator.position}`;
                this.frameData = frame;

                // determines if the current view is a single frame view, meaning that
                // no rotation operation is present for the view (static view)
                this.singleFrameView =
                    (this.configurator.frames[this.configurator.view] || 1) === 1;

                // updates the local loading variable to the false value, indicating
                // that the loading operation has just finished
                this.loading = false;

                // triggers the resize operation, as some pending resize operation
                // may have been pilling up during the loading operation, during which
                // is not possible to trigger resize operations
                this.resize(this.size, this.width, this.height);

                // updates the current frame in the store, this information can be used
                // by listener to update their internal state
                this.$store.commit("currentFrame", frame);
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

            this.$bus.bind("changed_frame", async (configurator, frame) => {
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

                try {
                    // triggers the async change frame operation on
                    // the current configurator
                    await this.configurator.changeFrame(frame, {
                        type: null,
                        duration: null
                    });
                } catch (error) {
                    // calls the registered callback handler for the
                    // error (default implementation is a simple re-throw)
                    this.onError(error);
                }
            });

            this.$bus.bind("show_frame", async (frame, options) => {
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

                try {
                    // triggers the async change frame operation on
                    // the current configurator
                    await this.configurator.changeFrame(frame, options);
                    this.frameData = frame;
                } catch (error) {
                    // calls the registered callback handler for the
                    // error (default implementation is a simple re-throw)
                    this.onError(error);
                }
            });

            if (this.configuratorType === "prc") this.bindConfiguratorEventsPrc();
            if (this.configuratorType === "csr") this.bindConfiguratorEventsCsr();
        },
        bindConfiguratorEventsPrc() {
            this.configurator.bind("highlighted_part", part => {
                this.$bus.trigger("highlighted_part", this.configurator, part);
            });

            this.configurator.bind("lowlighted", () => {
                this.$bus.trigger("lowlighted", this.configurator);
            });

            this.$bus.bind("highlight_part", part => {
                if (this.ignoreBus) return;
                if (this.configurator && this.configurator.ready) {
                    this.configurator.highlight(part);
                }
            });

            this.$bus.bind("lowlight_part", part => {
                if (this.ignoreBus) return;
                if (this.configurator && this.configurator.ready) {
                    this.configurator.lowlight(part);
                }
            });
        },
        bindConfiguratorEventsCsr() {
            this.configurator.bind("ready", options => {
                if (options?.origin?.startsWith("configurator")) {
                    this.loading = false;
                    this.configurator.resize();
                }
            });
        },
        async unbindConfigurator(configurator) {
            if (!configurator) return;
            await this.ripeInstance.unbindConfigurator(configurator);
        },
        /**
         * Re-sizes the configurator according to the current
         * available container size (defined by parent).
         */
        resize(size = null, width = null, height = null) {
            // in case the size is invalid or no valid configurator
            // is available then returns the control flow as nothing
            // can be done under such conditions
            if (!(size || (width && height)) || !this.configurator) return;

            // in case the configurator is currently under loading
            // then ignores the resize request as this would trigger
            // a race condition and block the loading process
            if (this.loading) return;

            // runs the underlying resize operation using the RIPE
            // SDK configurator element method
            this.configurator.resize(size, width, height);
        }
    },
    destroyed: async function() {
        await this.unbindConfigurator(this.configurator);
        this.configurator = null;
    }
};

export default Configurator;
</script>
