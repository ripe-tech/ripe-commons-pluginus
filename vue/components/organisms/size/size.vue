<template>
    <div class="size" v-bind:class="{ disabled: !enabled }">
        <div
            class="button button-color button-size"
            v-bind:class="buttonClasses"
            v-on:click="onButtonSizeClick"
        >
            <span>{{ buttonText }}</span>
        </div>
        <modal ref="modal">
            <div v-show="enabled">
                <component
                    v-bind:active.sync="active"
                    v-bind:title="modalTitleComputed || undefined"
                    v-bind:sub-title="modalSubTitleComputed || undefined"
                    v-bind:reference-scale="referenceScale || undefined"
                    v-bind:available-scales="availableScales || undefined"
                    v-bind:is="form"
                    ref="form"
                    v-bind:key="formKey"
                    v-on:changed="sizeChanged"
                />
                <div class="buttons-container">
                    <button-ripe
                        class="button button-color button-color-secondary button-cancel"
                        v-on:click="hideModal"
                    >
                        {{ cancelLabelComputed }}
                    </button-ripe>
                    <button-ripe
                        class="button button-color button-color-secondary button-apply"
                        v-bind:class="{ invalid: !allowApply }"
                        v-on:click="apply"
                    >
                        <span>{{ selectLabelComputed }}</span>
                    </button-ripe>
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
import { partMixin, modalMixin } from "../../../mixins";

export const Size = {
    name: "size",
    mixins: [partMixin, modalMixin],
    props: {
        buttonLabel: {
            type: String,
            default: null
        },
        buttonSelectedLabel: {
            type: String,
            default: null
        },
        modalTitle: {
            type: String,
            default: null
        },
        modalSubTitle: {
            type: String,
            default: null
        },
        selectLabel: {
            type: String,
            default: null
        },
        cancelLabel: {
            type: String,
            default: null
        }
    },
    data: function() {
        return {
            enabled: false,
            form: null,
            sizeText: "",
            sizeTextState: "",
            state: {},
            counter: 0,
            closeCallback: null,
            sizeLoaded: false,
            active: true,
            selectLabelData: this.selectLabel
        };
    },
    computed: {
        buttonText() {
            const buttonLabel =
                this.buttonLabel ||
                this.$store.state.sizeButtonLabel ||
                this.locale("ripe_commons.size.select_size");
            const buttonSelectedLabel =
                this.buttonSelectedLabel ||
                this.$store.state.sizeButtonSelectedLabel ||
                this.locale("ripe_commons.size.size");
            return this.sizeTextState
                ? (this.isMobileWidth() || this.isTabletWidth()
                      ? ""
                      : buttonSelectedLabel + " - ") + this.sizeTextState
                : buttonLabel;
        },
        buttonEnabled() {
            return this.enabled && this.active;
        },
        buttonClasses() {
            return { disabled: !this.buttonEnabled };
        },
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
        },
        referenceScale() {
            // if a specific reference scale is set then uses it
            // this can be done via URL or internal configuration
            if (this.$store.state.referenceScale) return this.$store.state.referenceScale;

            // looks at the configured 3DB sizes and uses the first
            // one to extract the reference scale
            const sizes = Object.keys(this.$store.state.config.sizes || {});
            if (sizes.length === 0) return null;

            // gets the scale and ignores the gender (e.g. "us:clothing:male"
            // results in "us:clothing")
            return sizes[0].split(":").slice(0, -1).join(":");
        },
        availableScales() {
            // uses the configured available scale if it exists,
            // otherwise defaults to the 3DB's configuration
            return this.$store.state.availableScales || this.$store.state.config.available_scales;
        },
        modalTitleComputed() {
            return this.modalTitle || this.$store.state.sizeModalTitle;
        },
        modalSubTitleComputed() {
            return this.modalSubTitle || this.$store.state.sizeModalSubTitle;
        },
        selectLabelComputed() {
            return (
                this.selectLabelData ||
                this.$store.state.sizeSelectLabel ||
                this.locale("ripe_commons.modal.select")
            );
        },
        cancelLabelComputed() {
            return (
                this.cancelLabel ||
                this.$store.state.sizeCancelLabel ||
                this.locale("ripe_commons.modal.cancel")
            );
        }
    },
    watch: {
        enabled: function(enabled) {
            !enabled && this.clear();
        },
        modelError: function(error) {
            this.enabled = !error;
        },
        sizeLoaded: function() {
            const sizeState = this.$store.getters.getSizeState();
            const sizeValid = sizeState.gender && sizeState.scale && sizeState.size;
            if (!sizeValid) return;

            // schedules the size change operation to be performed in
            // the next tick operation effectively changing the size according
            // to the initially set state in the global environment
            this.$nextTick(() => {
                this.$bus.trigger("size", sizeState);
            });
        },
        active: {
            handler: function(value) {
                this.$store.commit("sizeActive", value);
            },
            immediate: true
        }
    },
    created: function() {
        this.$bus.bind("enable_size", this.enableSize);
        this.$bus.bind("disable_size", this.disableSize);

        this.$bus.bind("open_size", (callback, uid = null, { selectLabel = null } = {}) => {
            // if this was the component instance that originated the
            // opening request, ignore it (only perform this validation
            // in case the UID has been explicitly requested)
            if (uid && uid === this._uid) return;

            this.selectLabelData = selectLabel || this.selectLabel;
            this.closeCallback = callback;
            this.showModal();
        });
        this.$bus.bind("close_size", (uid = null) => {
            // if this was the component instance that originated the
            // closing request, ignore it (only perform this validation
            // in case the UID has been explicitly requested)
            if (uid && uid === this._uid) return;

            // the closing callback should only run when the modal is visible
            // not doing so would trigger the close callback multiple times for
            // the multiple available size models (if that's the case)
            if (!this.visible) this.closeCallback = null;

            // triggers the hide modal operation (part of the mixin definition)
            // that should call the associated pre-defined hooks
            this.hideModal();
        });

        this.$bus.bind("pre_config", () => {
            this.enabled = false;
            this.active = true;
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
                .filter(
                    plugin =>
                        !plugin.meta.models ||
                        (plugin.meta.models && plugin.meta.models.includes(this.model))
                )
                .map(plugin => {
                    let value = 0;
                    value += plugin.meta.brand === this.brand ? 1 : 0;
                    value += plugin.meta.models && plugin.meta.models.includes(this.model) ? 1 : 0;
                    return [value, plugin];
                })
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
        this.updateSizeText();

        this.$bus.bind("refresh", () => {
            this.updateSizeText();
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
            this.updateSizeText();
            if (this.$refs.form) this.$refs.form.setState(this.state);
        });
    },
    methods: {
        apply() {
            this.$bus.trigger("size", this.state);
            this.hideModal();
        },
        clear() {
            if (this.form) this.$refs.form.reset();
        },
        modalBeforeEnter() {
            this.$bus.trigger("open_size", this.closeCallback, null, {
                selectLabel: this.selectLabelData
            });
            this.$refs.form.show();
        },
        modalBeforeLeave() {
            // restores the original state (state at the time of the modal
            // opening operation) to the modal so that the modal is restored
            this.originalState
                ? this.$refs.form.setState(this.originalState)
                : this.$refs.form.reset();
            this.updateSizeText();

            // triggers the close size event and the hides the form of the
            // managed by the "external" plugin
            this.$bus.trigger("close_size", this._uid);
            this.$refs.form.hide();
        },
        modalHidden() {
            // in case the allow apply flag is set and a close callback
            // exists calls it exactly one time
            if (this.allowApply && this.closeCallback) this.closeCallback();
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
            // marks the (initial) size loaded flag, effectively indicating
            // that the initial loading operation can be performed
            this.sizeLoaded = true;

            this.state = form.getState();
            this.sizeText = form.getSizeText();
            this.state.sizeText = this.sizeText;
            if (!this.visible) this.apply();
            if (!this.visible) this.updateSizeText();
        },
        updateSizeText() {
            this.sizeTextState = this.sizeText;
        },
        onButtonSizeClick() {
            // resets the modal's select button label, which might've
            // been set for a different "open size" context (via event)
            this.selectLabelData = this.selectLabel;

            // triggers the show model process effectively showing
            // the modal on the screen
            this.showModal();
        }
    }
};

export default Size;
</script>
