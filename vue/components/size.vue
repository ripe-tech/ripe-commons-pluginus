<template>
    <div class="size" v-bind:class="{ disabled: enabled === false }">
        <div class="button button-secondary button-size" v-on:click="showModal()" v-bind:class="{ disabled: enabled === false }">
            <span>{{ buttonText }}</span>
        </div>
        <modal ref="modal">
            <div v-show="enabled">
                <component
                    v-bind:is="form"
                    ref="form"
                    v-bind:key="formKey"
                    v-on:changed="sizeChanged"
                />
                <div class="buttons-container">
                    <div class="button button-cancel" v-on:click="hideModal()">
                        {{ "ripe_commons.modal.cancel" | locale }}
                    </div>
                    <div
                        class="button button-primary button-apply"
                        v-bind:class="{ invalid: !allowApply }"
                        v-on:click="apply()"
                    >
                        <span>{{ "ripe_commons.modal.select" | locale }}</span>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<style scoped>
.size.disabled {
    background-color: transparent;
    border-color: transparent;
    pointer-events: none;
}

.size .modal.modal-size .modal-container {
    padding: 40px 80px 40px 80px;
}
</style>

<script>
import { modalMixin } from "../mixins";

export const size = {
    mixins: [modalMixin],
    data: function() {
        return {
            enabled: false,
            form: null,
            sizeText: "",
            buttonText: "",
            state: {},
            counter: 0,
            closeCallback: null
        };
    },
    computed: {
        formKey() {
            return this.brand + "." + this.model + "." + this.counter;
        },
        originalState() {
            return this.$store.state.size;
        },
        allowApply() {
            return this.state.size && this.state.scale && this.state.gender;
        },
        visible() {
            return this.$refs.modal.visible;
        },
        hasSize() {
            return this.$store.state.hasSize;
        }
    },
    watch: {
        enabled(enabled) {
            !enabled && this.clear();
        },
        modelError(error) {
            this.enabled = !error;
        }
    },
    created: function() {
        this.$bus.bind("enable_size", this.enableSize);
        this.$bus.bind("disable_size", this.disableSize);

        this.$bus.bind("open_size", callback => {
            this.closeCallback = callback;
            this.showModal();
        });
        this.$bus.bind("close_size", () => {
            this.hideModal();
        });

        this.$bus.bind("pre_config", () => {
            this.enabled = false;
            this.form = null;
        });

        this.$bus.bind("post_config", async config => {
            // in case there's no valid config for this post operation
            // returns control flow immediately, should not happen
            if (!config || !this.hasSize) {
                return;
            }

            // gathers the complete set of plugins registered for sizing sorts
            // them according to the brand fitting property and then retrieves
            // the first plugin (best candidate)
            const plugins = (await this.manager.getPluginsByCapability("size"))
                .filter(plugin => !plugin.meta.brand || plugin.meta.brand === this.brand)
                .map(plugin => (plugin.meta.brand === this.brand ? [1, plugin] : [0, plugin]))
                .sort((a, b) => b[0] - a[0])
                .map(v => v[1]);
            const plugin = plugins.length ? plugins[0] : null;

            // in case there's no valid size plugin available raises an error
            // indicating the issue with size loading
            if (!plugin) {
                throw new Error(`No size component found for ${this.brand}`);
            }

            // retrieves its personalization component setting it as the form
            // component for this specific personalization scenario
            const form = await plugin.getSizeComponent();

            // increments the cache invalidation counter, internal hack to enable
            // proper computation of computed values
            this.counter += 1;

            // sets the form for the current component, sets it as enable and hidden
            // by default (initial state)
            this.form = form;
        });
    },
    mounted: function() {
        this.updateButtonText();

        this.$bus.bind("refresh", () => {
            this.updateButtonText();
        });
        this.$bus.bind("size", state => {
            if (
                this.state.size === state.size &&
                this.state.scale === state.scale &&
                this.state.gender === state.gender
            ) {
                return;
            }
            this.state = state;
            this.$refs.form.setState(this.state);
            this.updateButtonText();
        });
    },
    methods: {
        apply() {
            this.$store.commit("size", this.state);
            this.$bus.trigger("size", this.state);
            this.hideModal();
        },
        clear() {
            this.form && this.$refs.form.reset();
        },
        modalBeforeEnter() {
            this.$bus.trigger("open_size", this.closeCallback);
            this.$refs.form.show();
        },
        modalBeforeLeave() {
            this.$bus.trigger("close_size");
            this.$refs.form.hide();
        },
        modalHidden() {
            this.originalState
                ? this.$refs.form.setState(this.originalState)
                : this.$refs.form.reset();
            this.updateButtonText();
            this.closeCallback && this.allowApply && this.closeCallback();
            this.closeCallback = null;
        },
        enableSize() {
            if (!this.modelError) {
                this.enabled = true;
            }
        },
        disableSize() {
            this.enabled = false;
        },
        sizeChanged(form) {
            this.state = form.getState();
            this.sizeText = form.getSizeText();
            this.state.sizeText = this.sizeText;
            !this.visible && this.apply();
            !this.visible && this.updateButtonText();
        },
        updateButtonText() {
            this.buttonText = this.sizeText
                ? this.locale("ripe_commons.size.size") + " - " + this.sizeText
                : this.locale("ripe_commons.size.select_size");
        }
    }
};

export default size;
</script>
