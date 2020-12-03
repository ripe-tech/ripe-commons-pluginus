<template>
    <div
        class="personalization"
        v-bind:class="[brand, model, { disabled: !enabled }]"
        v-show="!hidden"
    >
        <div
            class="button button-color button-personalization"
            v-bind:class="{ disabled: !enabled }"
            v-on:click="showModal"
        >
            <h3>{{ locale("ripe_commons.personalization.personalization") }}</h3>
            <p class="button-text">
                {{ locale(buttonText) }}
            </p>
        </div>
        <modal ref="modal">
            <div v-show="enabled">
                <h3 class="title">
                    {{ locale("ripe_commons.personalization.personalization") }}
                </h3>
                <component
                    v-bind:valid.sync="valid"
                    v-if="form"
                    v-bind:is="form"
                    ref="form"
                    v-bind:key="formKey"
                    v-on:changed="formChanged"
                    v-on:hook:mounted="formMounted"
                />
                <div class="buttons-container">
                    <slot name="buttons" v-bind="{ valid }">
                        <div
                            class="button button-color button-color-secondary button-cancel"
                            v-on:click="hideModal"
                        >
                            {{ locale("ripe_commons.modal.cancel") }}
                        </div>
                        <div
                            class="button button-color button-apply"
                            v-bind:class="buttonApplyClasses"
                            v-on:click="apply"
                        >
                            {{ locale("ripe_commons.modal.apply") }}
                        </div>
                    </slot>
                </div>
            </div>
        </modal>
    </div>
</template>

<style scoped>
.personalization {
    display: inline-block;
    text-align: center;
}

.personalization.disabled {
    background-color: transparent;
    border-color: transparent;
    pointer-events: none;
}

.personalization > .button-personalization > .button-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.personalization ::v-deep .tabs {
    height: 70px;
}

.personalization ::v-deep .tabs .tab {
    line-height: 54px;
}

.personalization ::v-deep .keyboard.text {
    padding: 20px 70px 20px 70px;
}

body.tablet .personalization ::v-deep .keyboard.text,
body.mobile .personalization ::v-deep .keyboard.text {
    padding: 20px 0px 20px 0px;
}

.personalization ::v-deep .keyboard.special {
    padding: 40px 40px 44px 40px;
}

.personalization ::v-deep .keyboard.special .keyboard-row .keyboard-key {
    background-color: transparent;
    display: inline-block;
    height: auto;
    margin-right: 40px;
    user-select: none;
    width: 72px;
}

.personalization ::v-deep .keyboard.special .keyboard-row .keyboard-key:last-child {
    margin-right: 0px;
}

.personalization ::v-deep .keyboard.special .keyboard-row .keyboard-key.special .image-container {
    border-radius: 50%;
    height: 64px;
    margin: 0px auto 14px auto;
    overflow: hidden;
    position: relative;
    width: 64px;
}

.personalization ::v-deep .keyboard.special .keyboard-row .keyboard-key.special .image-container img {
    border-radius: 50%;
    height: 100%;
    object-fit: cover;
    width: 100%;
}

.personalization ::v-deep .keyboard.special .keyboard-row .keyboard-key.special .image-container .border {
    border: 2px solid #eaeaec;
    border-radius: 50%;
    height: calc(100% - 4px);
    left: 0px;
    position: absolute;
    top: 0px;
    transition: all 0.125s ease-in-out;
    width: calc(100% - 4px);
}

.personalization ::v-deep .keyboard.special .keyboard-row .keyboard-key.special.active .image-container .border {
    border-color: #ffffff;
    height: calc(100% - 10px);
    left: 3px;
    top: 3px;
    width: calc(100% - 10px);
}
</style>

<script>
import { modalMixin } from "../../../mixins";

/**
 * Top level personalization component that encapsulated
 * both the button that will trigger the personalization
 * and the modal that allows personalization.
 *
 * The form that allows personalization is dynamic and is
 * controlled by the Pluginus system so that it may be
 * adapted to the current configuration context (for the
 * best possible experience for the model).
 */
export const Personalization = {
    name: "personalization",
    mixins: [modalMixin],
    props: {
        pedantic: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            hidden: true,
            enabled: false,
            form: null,
            tabMessage: "",
            buttonText: "",
            state: {},
            counter: 0,
            initialOptions: null,
            valid: true
        };
    },
    computed: {
        /**
         * The original personalization state from which the
         * user has entered the personalization modal.
         *
         * @returns {Object} The object containing the personalization
         * definition considered the original one.
         */
        originalState() {
            return this.$store.state.personalization;
        },
        /**
         * If the current personalization modal is visible.
         *
         * @returns {Boolean} If the modal, is visible.
         */
        visible() {
            return this.$refs.modal.visible;
        },
        /**
         * The form's unique key that will identify this form
         * based on the current counter and model's identifier.
         *
         * @returns {String} The unique string for the current modal
         */
        formKey() {
            return `${this.brand}.${this.model}.${this.counter}`;
        },
        /**
         * If there's a valid personalization set under the current
         * store state.
         *
         * @returns {Boolean} If there's a valid personalization.
         */
        hasPersonalization() {
            return this.$store.state.hasPersonalization;
        },
        buttonApplyClasses() {
            return {
                disabled: !this.valid
            };
        }
    },
    watch: {
        enabled: function(enabled) {
            !enabled && this.clear();
        },
        state: {
            handler: function(state, previousState) {
                if (this.diffInitialsExtra(state.initialsExtra, previousState.initialsExtra)) {
                    this.$bus.trigger(
                        "initials_change",
                        this.sanitizeInitialsExtra(state.initialsExtra)
                    );
                }
            },
            deep: true
        }
    },
    created: function() {
        this.$bus.bind("enable_personalization", this.enablePersonalization);
        this.$bus.bind("disable_personalization", this.disablePersonalization);

        this.$bus.bind("open_personalization", this.showModal);
        this.$bus.bind("close_personalization", this.hideModal);

        this.$bus.bind("pre_config", () => {
            this.enabled = false;
            this.form = null;
            this.valid = true;
        });

        this.$bus.bind("post_config", async (config, options) => {
            // in case there's no valid config for this post operation
            // returns control flow immediately, should not happen
            if (!config || !this.hasPersonalization) {
                return;
            }

            // tries to retrieve the complete set of personalization plugins
            // that match the requested set of constrains for the new model
            // in configuration (if any) and sort them by matching similarity
            const plugins = (await this.manager.getPluginsByCapability("personalization"))
                .filter(plugin => {
                    if (plugin.isPersonalizationEligible) {
                        return plugin.isPersonalizationEligible(this.brand, this.model);
                    }
                    return (
                        (!plugin.meta.brand || plugin.meta.brand === this.brand) &&
                        (!plugin.meta.models || plugin.meta.models.includes(this.model))
                    );
                })
                .map(plugin => {
                    let value = 0;
                    if (plugin.meta.brand && plugin.meta.brand === this.brand) value++;
                    if (plugin.meta.models && plugin.meta.models.includes(this.model)) value++;
                    value += plugin.getPersonalizationPoints
                        ? plugin.getPersonalizationPoints(this.brand, this.mode)
                        : 0;
                    return [value, plugin];
                })
                .sort((a, b) => b[0] - a[0])
                .map(v => v[1]);

            // verifies that at least one plugin is found that is able to handle
            // the requirements for the current configuration scenario
            if (!plugins.length) {
                this.hidden = true;
                if (this.pedantic) {
                    throw Error(`No personalization component found for ${this.brand}`);
                }
                return;
            }

            // retrieves the first plugin (best candidate) and retrieves its
            // personalization component setting it as the form component for
            // this specific personalization scenario
            const plugin = plugins[0];
            const form = await plugin.getPersonalizationComponent();

            // increments the cache invalidation counter, internal hack to enable
            // proper computation of computed values
            this.counter += 1;

            // sets the form for the current component, then removes the hidden flag
            // and enables the personalization (button for personalization)
            this.form = form;
            this.hidden = false;
            this.enablePersonalization();

            // copies the provided options from the post config as the initial options
            // for the initials, to be used for context based initials settings
            this.initialOptions = Object.assign({}, options);
        });

        this.$bus.bind("initials_extra", initialsExtra => {
            if (this.diffInitialsExtra(initialsExtra, this.state.initialsExtra)) {
                this.state.initialsExtra = initialsExtra;
                if (this.$refs.form) this.$refs.form.setState(this.state);
            }
        });
    },
    mounted: function() {
        this.updateButtonText();
    },
    methods: {
        apply() {
            this.$store.commit("personalization", this.state);
            this.$bus.trigger("personalization", this.state, this.tabMessage);
            this.hideModal();
        },
        clear() {
            this.form && this.$refs.form.reset();
        },
        modalBeforeEnter() {
            this.$bus.trigger("open_personalization");
            this.$store.dispatch("refreshInitialsData");
            this.$refs.form.show();
        },
        modalBeforeLeave() {
            this.$bus.trigger("close_personalization");
            this.$refs.form.hide();
        },
        modalHidden() {
            this.originalState
                ? this.$refs.form.setState(this.originalState)
                : this.$refs.form.reset();
            this.updateButtonText();
        },
        enablePersonalization() {
            this.enabled = true;
        },
        disablePersonalization() {
            this.enabled = false;
        },
        formMounted() {
            const form = this.$refs.form;

            form.setState({
                initials: this.initialOptions.initials,
                engraving: this.initialOptions.engraving,
                initialsExtra: this.initialOptions.initialsExtra
            });

            this.personalizationChanged(form.getState(), form.getTabMessage());
        },
        formChanged(form) {
            this.personalizationChanged(form.getState(), form.getTabMessage());
        },
        personalizationChanged(state = {}, tabMessage = "") {
            // initializes the local variables with the default values
            // so that the default initials and engraving values are set
            let initials = state.initials || "";
            let engraving = state.engraving || null;

            // if the initials or the engraving don't give a "simple"
            // definition then tries to retrieve a valid value from
            // the initials extra definition
            if (!(initials && engraving) && state.initialsExtra) {
                const initialsSimple = this.initialsExtraToInitials(state.initialsExtra);
                initials = initialsSimple.initials;
                engraving = initialsSimple.engraving;
            }

            // updates the current state object with both initials, engraving
            // and the initials extra structure, either from the direct provided
            // state or from the conversion from the "simple" initials
            state.initials = initials;
            state.engraving = engraving;
            state.initialsExtra =
                state.initialsExtra || this.initialsToInitialsExtra(initials, engraving);

            // updates both the current internal state taking into account if an event
            // should be triggered or not (using internal state values)
            this.state = state;

            // updates the message for the tab according to the provided value to be
            // able to show the most up-to-date values
            this.tabMessage = tabMessage;

            // in case there's no visibility of the personalization then applies the
            // changes and then runs the update of the button text
            if (!this.visible) this.apply();
            if (!this.visible) this.updateButtonText();
        },
        updateButtonText() {
            this.buttonText = this.tabMessage || "ripe_commons.personalization.add_initials";
        },
        initialsToInitialsExtra(initials, engraving) {
            return {
                main: {
                    initials: initials,
                    engraving: engraving
                }
            };
        },
        initialsExtraToInitials(initialsExtra) {
            // checks if the initials groups are declared on the model
            // config and uses them to retrieve the initials value
            const configGroups = this.$store.state.config.initialsGroups;
            if (configGroups && configGroups.length) {
                let initials = "";
                let engraving = null;

                // tries to retrieve the values of the first valid
                // group, respecting the order of the declaration
                for (const groupName of configGroups) {
                    const group = initialsExtra[groupName];
                    if (!group) {
                        continue;
                    }
                    if (group.initials.length) {
                        initials = group.initials;
                        engraving = group.engraving;
                        break;
                    }
                }

                // if all the groups are defined and have the same engraving
                // then concatenates the initials according to the order of the groups
                if (
                    configGroups.every(
                        group =>
                            initialsExtra[group] &&
                            initialsExtra[group].initials &&
                            initialsExtra[group].engraving === engraving
                    )
                ) {
                    initials = configGroups.map(group => initialsExtra[group].initials).join(" ");
                }
                if (initials && engraving) {
                    return {
                        initials: initials,
                        engraving: engraving
                    };
                }
            }

            // if the groups are not declared then checks if a group named
            // "main" is defined and returns its values
            const mainGroup = initialsExtra.main;
            if (mainGroup) {
                return mainGroup;
            }

            // sorts the group names alphabetically and returns the first
            // group with initials defined
            const keys = Object.keys(initialsExtra).sort();
            for (const key of keys) {
                const group = initialsExtra[key];
                if (group.initials.length) {
                    return group;
                }
            }

            // if no group has valid initials then returns empty values
            return {
                initials: "",
                engraving: ""
            };
        }
    }
};

export default Personalization;
</script>
