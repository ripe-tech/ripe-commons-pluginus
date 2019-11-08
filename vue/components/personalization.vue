<template>
    <div class="personalization" v-bind:class="[brand, model, { disabled: enabled === false }]">
        <div
            class="button button-personalization"
            v-bind:class="{ disabled: enabled === false, show: !hidden }"
            v-on:click="showModal()"
        >
            <h3>{{ "ripe_commons.personalization.personalization" | locale }}</h3>
            <p>{{ buttonText | locale }}</p>
        </div>
        <modal ref="modal">
            <div v-show="enabled">
                <h3 class="title">{{ "ripe_commons.personalization.personalization" | locale }}</h3>
                <component
                    v-bind:is="form"
                    ref="form"
                    v-bind:key="formKey"
                    v-on:changed="formChanged"
                    v-on:hook:mounted="formMounted"
                />
                <div class="buttons-container">
                    <div class="button button-cancel" v-on:click="hideModal()">
                        {{ "ripe_commons.modal.cancel" | locale }}
                    </div>
                    <div class="button button-primary button-apply" v-on:click="apply()">
                        {{ "ripe_commons.modal.apply" | locale }}
                    </div>
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
    height: auto;
    margin-right: 40px;
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
    border: solid 2px #eaeaec;
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
import { modalMixin } from "../mixins";

export const personalization = {
    mixins: [modalMixin],
    data: function() {
        return {
            hidden: true,
            enabled: true,
            form: null,
            tabMessage: "",
            buttonText: "",
            state: {},
            counter: 0,
            initialOptions: null
        };
    },
    computed: {
        originalState() {
            return this.$store.state.personalization;
        },
        visible() {
            return this.$refs.modal.visible;
        },
        formKey() {
            return this.brand + "." + this.model + "." + this.counter;
        },
        hasPersonalization() {
            return this.$store.state.hasPersonalization;
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
        });

        this.$bus.bind("post_config", async (config, options) => {
            // in case there's no valid config for this post operation
            // returns control flow immediately, should not happen
            if (!config || !this.hasPersonalization) {
                return;
            }

            const plugins = (await this.manager.getPluginsByCapability("personalization"))
                .filter(plugin => !plugin.meta.brand || plugin.meta.brand === this.brand)
                .map(plugin => (plugin.meta.brand === this.brand ? [1, plugin] : [0, plugin]))
                .sort((a, b) => b[0] - a[0])
                .map(v => v[1]);

            if (!plugins.length) {
                this.hidden = true;
                throw Error(`No personalization component found for ${this.brand}`);
            }

            // retrieves the first plugin (best candidate) and retrieves its
            // personalization component setting it as the form component for
            // this specific personalization scenario
            const plugin = plugins[0];
            const form = await plugin.getPersonalizationComponent();

            // increments the cache invalidation counter, internal hack to enable
            // proper computation of computed values
            this.counter += 1;

            // sets the form for the current component, sets it as enable and hidden
            // by default (initial state)
            this.form = form;
            this.enabled = true;
            this.hidden = false;

            this.initialOptions = Object.assign({}, options);
        });

        this.$bus.bind("initials_extra", initialsExtra => {
            if (this.diffInitialsExtra(initialsExtra, this.state.initialsExtra)) {
                this.state.initialsExtra = initialsExtra;
                this.$refs.form && this.$refs.form.setState(this.state);
            }
        });
    },
    mounted: function() {
        this.updateButtonText();
    },
    methods: {
        apply() {
            this.$store.commit("personalization", this.state);
            this.$bus.trigger("personalization", this.state);
            this.hideModal();
        },
        clear() {
            this.form && this.$refs.form.reset();
        },
        modalBeforeEnter() {
            this.$bus.trigger("open_personalization");
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
            console.log("InitialsExtra: " + Boolean(state.initialsExtra)
                +"  Initials: " + Boolean(initials)
                +"  Engraving: " + Boolean(engraving));
            debugger;
            if (!(initials && engraving) && state.initialsExtra) {
                debugger;
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

            // updates both the current internal state and the (possible) new tab
            // message from the form
            this.state = state;
            this.tabMessage = tabMessage;

            // in case there's no visibility of the personalization then applies the
            // changes and then runs the update of the button text
            !this.visible && this.apply();
            !this.visible && this.updateButtonText();
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
            debugger;
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
                    debugger;
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

export default personalization;
</script>
