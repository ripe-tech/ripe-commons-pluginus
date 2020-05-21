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
            throw new Error("Element #app not found");
        }

        // initializes the Vue.js reactive data store according to the
        // underlying specification defined by `_getStoreDef`
        await this._initStore();

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
        this.app = await this._initVueApp(this.appElement);

        // allocates space for the object that will hold the target model
        // configuration to be applied to the ripe instance
        const config = {};

        // in case there's a brand and model defined we should follow the
        // "typical" setting of options according to brand and model
        if (this.options.brand && this.options.model) {
            Object.assign(config, {
                brand: this.options.brand,
                model: this.options.model,
                version: this.options.version || null,
                parts: this.options.parts || {}
            });
        } else if (this.options.dku) {
            Object.assign(config, { dku: this.options.dku });
        }
        // otherwise if there's a valid product id defined then we should resolve
        // it and update the current options with its resolved values
        else if (this.options.product_id) {
            const isQuery = this.options.product_id.startsWith("query:");
            const isDku = this.options.product_id.startsWith("dku:");
            const isProductId = !isQuery && !isDku;
            if (isQuery) {
                Object.assign(config, { query: this.options.product_id.slice(6) });
            } else if (isDku) {
                Object.assign(config, { dku: this.options.product_id.slice(4) });
            } else if (isProductId) {
                Object.assign(config, { productId: this.options.product_id });
            } else {
                throw new Error("No valid product ID structure");
            }
        }

        // runs the setting of the model & configuration according to the currently set
        // options (initial bootstrap operation), handling critical error as expected
        this.setModelConfig(config).catch(async err => await this._handleCritical(err));
    }

    async unload() {
        this.helperPlugins = null;
        this.localePlugin = null;
        await super.unload();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("start"), RipeCommonsCapability.new("ripe-provider")];
    }

    async setModel(options = null, safe = true) {
        if (safe && this.configuring) {
            this.app.logInfo(() => "Delaying set model, still configuring...");
            this.pending = options || true;
            return;
        }

        // in case no options are provided then the options currently
        // set in the instance are used instead
        if (options === null) options = this.options;

        this.configuring = true;
        this.pending = undefined;

        // creates a copy of the options setting the safe flag with the
        // value that has been set in the operation
        options = Object.assign({ safe: safe }, options);

        try {
            // validates that all of the pre-condition required for model
            // setting are fulfilled, otherwise raises errors
            if (!options.brand) throw Error("No brand defined in context");
            if (!options.model) throw Error("No model defined in context");

            // prints a small info message about the new model to be set
            this.app.logInfo(() => `Setting model ${JSON.stringify(options, null, 2)}`);

            // updates the config of the ripe object, this should
            // start the process of loading a specific model
            await this.ripe.config(options.brand, options.model, options);
            this.app.$store.commit("error", null);
        } catch (err) {
            // in case there's an error the error is set in the store
            // state so that it can be consulted by the components
            this.app.$store.commit("error", err || true);

            // triggers the error event in the current app indicating
            // that an error error state has been reached in set model
            this.app.$bus.trigger("error", err || true);

            // on top of the config error being set on the store a proper
            // exception is also thrown indicating the issue
            throw err;
        } finally {
            // unset the safe flag for configuration, allowing further configuration
            // to take place, as it's now considered safe
            this.configuring = false;

            // in case there's a configuration pending (meaning it has been requested
            // in the middle of the previous one) it's now time to set it as the model
            if (this.pending) {
                this.app.logInfo(() => "Processing delayed set model...");
                this.setModel(typeof this.pending === "object" ? this.pending : null);
            }
        }
    }

    async setModelConfig({
        brand = null,
        model = null,
        version = null,
        query = null,
        dku = null,
        productId = null,
        setModel = true,
        ...extra
    } = {}) {
        let config = {};

        if (query) {
            config = this.ripe._queryToSpec(query);
        } else if (dku) {
            config = await this.ripe.configDkuP(dku);
        } else if (productId) {
            config = await this.ripe.configResolveP(productId);
        }

        // updates the currently set options with the model configuration
        // provided (base object contains current brand and model)
        this.options = Object.assign(
            {
                brand: brand,
                model: model,
                version: version,
                parts: {}
            },
            extra,
            config
        );

        // in case no model setting is effectively required then return
        // the control flow immediately (only options are changed)
        if (!setModel) return;

        // runs the set model operation using the newly resolved options
        // and waiting for it to finalize (as expected)
        await this.setModel(this.options);
    }

    async setRipeOptions(options, force = false) {
        const changed = Object.entries(options).some(
            ([key, value]) => this.ripe.options[key] !== value
        );
        if (!changed && !force) return;
        await this.ripe.config(this.ripe.brand, this.ripe.model, { ...options });
    }

    _bind() {
        // listens for the 'set_model' event to change the
        // model accordingly
        this.owner.bind("set_model", this.setModel.bind(this));

        // updates the app state when a new model is set
        this.ripe.bind("post_config", config => {
            this.app.logDebug(
                () => `SDK configuration changed: ${JSON.stringify(config, null, 2)}`
            );
            this.store.commit("config", config);
            this.store.commit("model", {
                brand: this.ripe.brand,
                model: this.ripe.model,
                variant: this.ripe.options.variant,
                version: this.ripe.options.version,
                description: this.ripe.options.description,
                product_id: this.ripe.options.product_id,
                dku: this.ripe.options.dku,
                parts: this.ripe.parts || {}
            });
            this.store.commit("format", this.ripe.format);
            this.store.commit("resolution", this.ripe.size);
            this.store.commit("backgroundColor", this.ripe.backgroundColor);
            this.store.commit("ripeOptions", this.ripe.options);
            this.store.commit("ripeState", {
                variant: this.ripe.variant,
                version: this.ripe.version,
                dku: this.ripe.dku,
                url: this.ripe.url,
                webUrl: this.ripe.webUrl,
                parts: this.ripe.parts,
                country: this.ripe.country,
                currency: this.ripe.currency,
                locale: this.ripe.locale,
                flag: this.ripe.flag,
                format: this.ripe.format,
                backgroundColor: this.ripe.backgroundColor,
                guess: this.ripe.guess,
                guessUrl: this.ripe.guessUrl,
                remoteCalls: this.ripe.remoteCalls,
                remoteOnConfig: this.ripe.remoteOnConfig,
                remoteOnPart: this.ripe.remoteOnPart,
                remoteOnInitials: this.ripe.remoteOnInitials,
                noBundles: this.ripe.noBundles,
                useBundles: this.ripe.useBundles,
                noDefaults: this.ripe.noDefaults,
                useDefaults: this.ripe.useDefaults,
                noCombinations: this.ripe.noCombinations,
                useCombinations: this.ripe.useCombinations,
                noPrice: this.ripe.noPrice,
                usePrice: this.ripe.usePrice,
                noDiag: this.ripe.noDiag,
                useDiag: this.ripe.useDiag
            });

            this.store.commit("hasCustomization", this.ripe.hasCustomization());
            this.store.commit("hasPersonalization", this.ripe.hasPersonalization());
            this.store.commit("hasSize", this.ripe.hasSize());
        });

        // changes some internal structure whenever there's an update
        // on the underlying ripe instance
        this.ripe.bind("post_update", options => {
            this.app.logDebug(() => `SDK update: ${JSON.stringify(options, null, 2)}`);
        });

        // updates some of the internal store setting whenever there's
        // a change in the internal ripe settings
        this.ripe.bind("settings", () => {
            this.app.logDebug(() => "SDK settings changed");
            this.store.commit("format", this.ripe.format);
            this.store.commit("resolution", this.ripe.size);
            this.store.commit("backgroundColor", this.ripe.backgroundColor);
        });

        // listens for parts and prices changes and updates the store
        this.ripe.bind("parts", parts => {
            this.app.logDebug(() => "SDK parts changed");
            this.store.commit("parts", parts);
        });
        this.ripe.bind("price", price => {
            this.app.logDebug(() => `SDK price changed: ${price.total.price_final}`);
            this.store.commit("price", price);
        });

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
        Vue.mixin(mixins.loggingMixin);

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

    async _initStore() {
        Vue.use(Vuex);
        this.store = new Vuex.Store(this._getStoreDef());
    }

    async _initVueApp(element) {
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
                this.$bus.bind("format_change", format => self.ripe.setFormat(format));
                this.$bus.bind("size_change", size => self.ripe.setSize(size));
                this.$bus.bind("background_color_change", backgroundColor =>
                    self.ripe.setBackgroundColor(backgroundColor)
                );
                this.$bus.bind("part_change", (part, material, color) =>
                    self.ripe.setPart(part, material, color)
                );
                this.$bus.bind("initials_change", initialsExtra => {
                    self.ripe.setInitialsExtra(initialsExtra);
                });
                this.$bus.bind("previous_frame", () =>
                    self.ripe.getChildren("Configurator").forEach(c => c.previousFrame())
                );
                this.$bus.bind("next_frame", () =>
                    self.ripe.getChildren("Configurator").forEach(c => c.nextFrame())
                );
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

                // registers a watch operation on the (image) format field of
                // the data store so that the change is propagated to the ripe
                // instance and then to the user interface
                this.$store.watch(this.$store.getters.getFormat, format =>
                    this.$bus.trigger("format_change", format)
                );

                // registers a watch operation on the (image) resolution field of
                // the data store so that the change is propagated to the ripe
                // instance and then to the user interface
                this.$store.watch(this.$store.getters.getResolution, resolution =>
                    this.$bus.trigger("size_change", resolution)
                );

                // registers a watch operation on the (image) background color field of
                // the data store so that the change is propagated to the ripe
                // instance and then to the user interface
                this.$store.watch(this.$store.getters.getBackgroundColor, backgroundColor =>
                    this.$bus.trigger("background_color_change", backgroundColor)
                );

                // registers a watch operation on all options
                // and updates the RIPE instance accordingly
                this.$store.watch(
                    this.$store.getters.getRipeOptions,
                    async ripeOptions => await self.setRipeOptions(ripeOptions)
                );
                this.$store.watch(
                    this.$store.getters.getRipeState,
                    async ripeState => await self.setRipeOptions(ripeState)
                );
            }
        });

        app.logInfo(() => "RIPE Commons application initializing...");

        return app;
    }

    async _handleCritical(err) {
        alert(err.message ? err.message : String(err));
    }
}

export { RipeCommonsMainPlugin };
