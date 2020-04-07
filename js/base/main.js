import "ripe-sdk/src/css/ripe.css";

import Vue from "vue";
import Vuex from "vuex";
import GlobalEvents from "vue-global-events";
import { Ripe } from "ripe-sdk";

import { components, plugins, mixins, store } from "../../vue";
import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

class RipeCommonsMainPlugin extends RipeCommonsPlugin {
    /**
     * Static method that retrieve the value of the field for the
     * provided URL or query string, if provided otherwise uses
     * the current URL query for the field retrieval.
     *
     * @param {String} name The name of the query string field to
     * retrieve the value.
     * @param {String/URLSearchParams} url The URL string or the URL
     * search param structure to be used in parsing.
     * @param {Object} fallback The default value to be returned in case it's
     * not possible to find a valid field for the provided name.
     * @param {Boolean} sequence If the returned value should be a sequence or
     * if instead the first element should be returned.
     * @returns {String} The value for the requested field name.
     */
    static _field(name, query = null, fallback = null, sequence = null) {
        query = query || new URLSearchParams(window.location.search);

        const params = query.getAll(name);

        if (params.length === 0) {
            return fallback;
        }

        if (sequence === null) sequence = params.length > 1;
        return sequence ? params : params[0];
    }

    async load() {
        await super.load();

        // gathers both all of the helper plugins and all of the
        // locale plugins, to be used by this "manager"
        this.helperPlugins = await this.owner.getPluginsByCapability("helper");
        this.localePlugin = await this.owner.getPluginByName("LocalePlugin");

        // tries to retrieve the DOM element where the vue app will be
        // mounted, throwing and error if it doesn't exist
        this.appElement = document.getElementById("app");
        if (!this.appElement) {
            throw Error("Element #app not found");
        }

        // initializes the Vue.js reactive data store according to the
        // underlying specification defined by `_getStoreDef`
        this._initStore();

        // reads and parses the options from the URL
        // initializes the app state accordingly
        await this._loadOptions();

        // initializes the RIPE object and its required plugins
        this.restrictionsPlugin = new Ripe.plugins.RestrictionsPlugin();
        this.syncPlugin = new Ripe.plugins.SyncPlugin();
        this.ripe = new Ripe(null, null, {
            plugins: [this.restrictionsPlugin, this.syncPlugin],
            ...this.options
        });

        // waits for the complete of the RIPE SDK loading process
        // so that all the necessary components are loaded
        await this.ripe.isReady();

        // binds to the necessary events sent through the owner
        this._bind();

        // loads the vue components and mixins to be used on
        // the vue app and starts it
        await this._loadVue();
        this.app = this._initVueApp(this.appElement);

        // in case there's a valid product id defined that we should resolve
        // it and update the current options with its resolved values
        if (!(this.options.brand && this.options.model) && this.options.product_id) {
            let model = null;
            const isQuery = this.options.product_id.startsWith("query:");
            const isDku = this.options.product_id.startsWith("dku:");
            const isProductId = !isQuery && !isDku;
            if (isQuery) {
                model = this.ripe._queryToSpec(this.options.product_id.slice(6));
            } else if (isDku) {
                model = await this.ripe.configDku(this.options.product_id.slice(4));
            } else if (isProductId) {
                model = await this.ripe.configResolveP(this.options.product_id);
            } else {
                throw Error("No valid product ID structure");
            }
            this.options = Object.assign(this.options, model);
        }

        // runs the setting of the model according to the currently set
        // options (initial bootstrap operation)
        this.setModel(this.options).catch(async err => await this._handleCritical(err));
    }

    async unload() {
        this.helperPlugins = null;
        this.localePlugin = null;
        await super.unload();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("start"), RipeCommonsCapability.new("ripe-provider")];
    }

    async setModel(options = null) {
        // in case not options are provided then the options currently
        // set in the instance are used
        if (options === null) options = this.options;

        try {
            // updates the config of the ripe object, this should
            // start the process of loading a specific model
            await this.ripe.config(options.brand, options.model, options);
            this.app.$store.commit("error", null);
        } catch (err) {
            // in case there's an error the error is set in the store
            // state so that it can be consulted by the components
            this.app.$store.commit("error", err || true);

            // on top of the config error being set on the store a proper
            // exception is also thrown indicating the issue
            throw err;
        }
    }

    _bind() {
        // listens for the 'set_model' event to change the
        // model accordingly
        this.owner.bind("set_model", this.setModel.bind(this));

        // updates the app state when a new model is set
        this.ripe.bind("post_config", config => {
            this.store.commit("config", config);
            this.store.commit("model", {
                brand: this.ripe.brand,
                model: this.ripe.model,
                variant: this.ripe.options.variant,
                description: this.ripe.options.description,
                product_id: this.ripe.options.product_id,
                dku: this.ripe.options.dku,
                parts: this.ripe.parts || {}
            });
            this.store.commit("hasCustomization", this.ripe.hasCustomization());
            this.store.commit("hasPersonalization", this.ripe.hasPersonalization());
            this.store.commit("hasSize", this.ripe.hasSize());
        });

        // listens for parts and prices changes and updates the store
        this.ripe.bind("parts", parts => this.store.commit("parts", parts));
        this.ripe.bind("price", price => this.store.commit("price", price));

        // forwards the parts events to the global bus
        this.ripe.bind("pre_parts", (...args) => this.owner.trigger("pre_parts", ...args));
        this.ripe.bind("parts", (...args) => this.owner.trigger("parts", ...args));
        this.ripe.bind("post_parts", (...args) => this.owner.trigger("post_parts", ...args));

        // forwards the config events to the global bus
        this.ripe.bind("pre_config", (...args) => this.owner.trigger("pre_config", ...args));
        this.ripe.bind("config", (...args) => this.owner.trigger("config", ...args));
        this.ripe.bind("post_config", (...args) => this.owner.trigger("post_config", ...args));

        // forwards the some other events to the global bus
        this.ripe.bind("selected_part", (...args) => this.owner.trigger("selected_part", ...args));
        this.ripe.bind("choices", (...args) => this.owner.trigger("choices", ...args));

        this.ripe.bind("initials", (...args) => this.owner.trigger("initials", ...args));
        this.ripe.bind("initials_extra", (...args) =>
            this.owner.trigger("initials_extra", ...args)
        );
    }

    _getExtraComponents() {
        return {};
    }

    _getStoreDef() {
        return store;
    }

    _installComponents(components) {
        for (const name of Object.keys(components)) {
            const component = components[name];
            const componentName = component.name ? component.name : name;
            Vue.component(componentName, component);
        }
    }

    async _loadVue() {
        // register the vue components so that they can initialized
        // from the templates, only after this call can the templates
        // use these components safely
        this._installComponents(components);
        this._installComponents(this._getExtraComponents());

        // registers the store and utils mixins so they are set on
        // all components, this applies directly on component creation
        Vue.mixin(mixins.logicMixin);
        Vue.mixin(mixins.utilsMixin);

        // initializes the event bus that will be used for
        // UI related communication between the components
        Vue.use(plugins.busPlugin);

        // adds a reference to the ripe object on the vue
        // components
        Vue.use(plugins.ripePlugin, this.ripe);

        // initializes the vue plugin that provides an
        // interface between the components and the
        // locale plugin
        Vue.use(plugins.localePlugin, this.localePlugin);

        // registers the usage of the global events component
        // as this is going to be used by multiple parts
        Vue.component("global-events", GlobalEvents);

        // returns the global vue instance so that methods that
        // inherit from this may use the same reference
        return Vue;
    }

    async _loadOptions(validate = true) {
        throw new Error("_loadOptions is not implemented.");
    }

    _initStore() {
        Vue.use(Vuex);
        this.store = new Vuex.Store(this._getStoreDef());
    }

    _initVueApp(element) {
        // saves references to the context and to the owner
        // to be used inside the vue app
        const self = this;
        const manager = this.owner;
        const app = new Vue({
            el: element,
            provide: function() {
                return {
                    manager: manager
                };
            },
            store: this.store,
            created: function() {
                // triggers the refresh of the UI when the
                // locale changes
                manager.bind("locale", () => {
                    this.$bus.trigger("refresh");
                });

                // pipes the (plugin) manager events to the vue bus
                manager.bind("pre_parts", (...args) => this.$bus.trigger("pre_parts", ...args));
                manager.bind("parts", (...args) => this.$bus.trigger("parts", ...args));
                manager.bind("post_parts", (...args) => this.$bus.trigger("post_parts", ...args));
                manager.bind("pre_config", (...args) => this.$bus.trigger("pre_config", ...args));
                manager.bind("config", (...args) => this.$bus.trigger("config", ...args));
                manager.bind("post_config", (...args) => this.$bus.trigger("post_config", ...args));
                manager.bind("selected_part", (...args) =>
                    this.$bus.trigger("selected_part", ...args)
                );
                manager.bind("choices", (...args) => this.$bus.trigger("choices", ...args));
                manager.bind("initials", (...args) => this.$bus.trigger("initials", ...args));
                manager.bind("initials_extra", (...args) =>
                    this.$bus.trigger("initials_extra", ...args)
                );

                // pipes the ripe plugins events to the vue bus, allows
                // so that UI components can "respond" to changes
                self.restrictionsPlugin.bind("restrictions", (...args) =>
                    this.$bus.trigger("restrictions", ...args)
                );
                self.syncPlugin.bind("sync", (...args) => this.$bus.trigger("sync", ...args));

                // updates the ripe instance when a part or personalization
                // is changed (imperative/action events)
                this.$bus.bind("part_change", (part, material, color) =>
                    self.ripe.setPart(part, material, color)
                );
                this.$bus.bind("initials_change", initialsExtra => {
                    self.ripe.setInitialsExtra(initialsExtra);
                });
                this.$bus.bind("undo", () => self.ripe.undo());
                this.$bus.bind("redo", () => self.ripe.redo());
                this.$bus.bind("start_over", () => self.ripe.undoAll());

                // listens for any model change and triggers the
                // 'model_changed' event on the owner, so that it's
                // possible to be notified at any level about this
                // data driven operations
                this.$store.watch(
                    this.$store.getters.getModelState,
                    modelState => manager.trigger("model_changed", modelState),
                    {
                        deep: true
                    }
                );
            }
        });

        return app;
    }

    async _handleCritical(err) {
        alert(err.message ? err.message : String(err));
    }
}

export { RipeCommonsMainPlugin };
