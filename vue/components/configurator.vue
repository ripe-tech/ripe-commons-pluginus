<template>
    <div class="configurator-container">
        <loader class="loader" v-if="!modelLoaded && !modelError" />
        <div class="configurator" v-bind:class="{ loading: loading }">
            <div class="config" ref="configurator" />
            <div class="error" v-if="modelError">
                Problem loading model {{ model }} from brand {{ brand }}<br />
                {{ errorMessage ? errorMessage : "" }}
            </div>
            <div class="holder" v-bind:class="{ disappear: hideHolder }">
                <div class="holder-label">
                    {{ "ripe_commons.holder.holder.label" | locale }}
                </div>
                <img class="holder-image" src="~./assets/drag_to_rotate-icon.svg" />
                <div class="holder-second-label">
                    {{ "ripe_commons.holder.holder-second-label.label" | locale }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.configurator {
    position: relative;
    text-align: center;
    transition: opacity 0.125s ease-in;
}

.configurator.loading {
    opacity: 0;
}

.configurator.highlight {
    cursor: pointer;
}

.loader {
    left: 50%;
    position: absolute;
    top: 40%;
}

.holder {
    bottom: 5px;
    pointer-events: none;
    position: absolute;
    transition: opacity 2s;
    width: 100%;
}

.holder.disappear {
    opacity: 0;
}

.holder-image {
    height: 77px;
    max-width: 100%;
}

.holder-second-label {
    color: #afafaf;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.holder-label {
    color: #afafaf;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: -55px;
    text-transform: uppercase;
}
</style>

<script>
/**
 * The component that contains the RIPE SDK's configurator, responsible
 * for forwarding its events to the Vue bus, as well the other way
 * around.
 */
export const configurator = {
    props: {
        options: {
            type: Object,
            required: false,
            default: function() {
                return {
                    duration: 250,
                    useMasks: true,
                    configAnimate: false
                };
            }
        },
        initialFrame: {
            type: String,
            default: null,
            required: false
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
            default: 5000
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
            return this.frameChanged || this.holderTimedOut;
        }
    },
    data: function() {
        return {
            frame: this.initialFrame,
            loading: true,
            /**
             * Listener flag that represents if a rotation have been made.
             */
            frameChanged: false,
            /**
             * Indicates whether the time accepted for the
             * holder to appear on the display has timedout.
             */
            holderTimedOut: false
        };
    },
    mounted: function() {
        setTimeout(() => {
            this.holderTimedOut = true;
        }, this.timeoutHolder);

        this.configurator = this.$ripe.bindConfigurator(this.$refs.configurator, this.options);

        this.configurator.bind("changed_frame", frame => {
            // sets the frame changed flag and then updates
            // the frame key to the new one (internal copy)
            this.frameChanged = true;
            this.frame = frame;

            // only the visible instance of this component
            // should be sending events it's considered to
            // be the main/master one
            if (this.elementDisplayed) {
                this.$store.commit("current_frame", frame);
                this.$bus.trigger("changed_frame", frame);
            }
        });

        this.configurator.bind("loaded", () => {
            const frame = `${this.configurator.view}-${this.configurator.position}`;
            this.frame = frame;
            this.loading = false;
            this.$store.commit("current_frame", frame);
        });

        this.$bus.bind("pre_config", () => {
            this.loading = true;
        });

        this.$bus.bind("changed_frame", frame => {
            // avoid infinite loop, by checking if the frame
            // is the one we're currently on
            if (this.frame === frame) {
                return;
            }

            if (this.configurator.ready) {
                this.configurator.changeFrame(frame, {
                    type: null,
                    duration: null
                });
            }
        });

        this.$bus.bind("show_frame", frame => {
            const currentView = this.frame.split("-")[0];
            const newView = frame.split("-")[0];
            const sameView = currentView === newView;
            const type = sameView ? false : "cross";
            const revolutionDuration = sameView ? 500 : null;
            if (this.configurator.ready) {
                this.configurator.changeFrame(frame, {
                    type: type,
                    revolutionDuration: revolutionDuration
                });
            }
        });

        this.$bus.bind("highlight_part", part => {
            this.configurator.ready && this.configurator.highlight(part);
        });

        this.$bus.bind("lowlight_part", part => {
            this.configurator.ready && this.configurator.lowlight(part);
        });

        this.resize(this.size);
    },
    watch: {
        size(size) {
            this.resize(size);
        }
    },
    methods: {
        /**
         * Re-sizes the configurator according to the current
         * available container size (defined by parent).
         */
        resize(size) {
            if (!size || !this.configurator) {
                return;
            }
            this.configurator.resize(size);
        }
    },
    destroyed: function() {
        this.configurator && this.$ripe.unbindConfigurator(this.configurator);
        this.configurator = null;
    }
};

export default configurator;
</script>
