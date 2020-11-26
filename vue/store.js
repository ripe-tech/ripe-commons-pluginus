export const store = {
    state: {
        ripeUrl: "",
        country: "",
        currency: "",
        locale: "",
        brand: "",
        model: "",
        dku: "",
        productId: "",
        variant: "",
        version: "",
        description: "",
        flag: "",
        format: "",
        resolution: "",
        backgroundColor: "",
        theme: null,
        parts: {},
        config: {},
        defaults: {},
        options: {},
        price: null,
        personalization: {
            initials: "",
            engraving: null,
            initialsExtra: {}
        },
        size: {},
        currentFrame: null,
        error: null,
        hasCustomization: false,
        hasPersonalization: false,
        hasSize: false,
        ripeOptions: {},
        ripeState: {},
        initialsDataPromise: null,
        initialsGroups: null,
        initialsSupportedCharacters: null
    },
    mutations: {
        ripeUrl(state, url) {
            state.ripeUrl = url;
        },
        model(state, model) {
            state.brand = model.brand;
            state.model = model.model;
            state.dku = model.dku;
            state.productId = model.product_id;
            state.variant = model.variant;
            state.version = model.version;
            state.description = model.description;
            state.parts = model.parts;
        },
        flag(state, flag) {
            state.flag = flag;
        },
        format(state, format) {
            state.format = format;
        },
        resolution(state, resolution) {
            state.resolution = resolution;
        },
        backgroundColor(state, backgroundColor) {
            state.backgroundColor = backgroundColor;
        },
        theme(state, theme) {
            state.theme = theme;
        },
        parts(state, parts) {
            state.parts = Object.assign({}, parts);
        },
        config(state, config) {
            config = config || {};
            const parts = config.parts || [];
            const defaults = config.defaults || {};
            const options = {};
            for (const part of parts) {
                const defaultPart = defaults[part.name] || {};
                if (defaultPart.hidden === true) {
                    continue;
                }
                const partM = {};
                for (const material of part.materials) {
                    partM[material.name] = material.colors;
                }
                options[part.name] = partM;
            }

            state.config = config;
            state.defaults = defaults;
            state.options = options;
            state.sync = config.sync;
        },
        price(state, price) {
            state.price = price;
        },
        personalization(state, value) {
            const groups = Object.keys(value);
            const mainGroup = groups.includes("main") ? "main" : groups[0];
            const mainInitials = value[mainGroup] || {};

            const initials = value.initials === undefined ? mainInitials.initials : value.initials;
            const engraving =
                value.engraving === undefined ? mainInitials.engraving : value.engraving;

            state.personalization.initials = initials || "";
            state.personalization.engraving = engraving || null;
            state.personalization.initialsExtra = Object.assign({}, value.initialsExtra);
        },
        size(state, value) {
            state.size = value;
        },
        currency(state, currency) {
            state.currency = currency;
        },
        locale(state, locale) {
            state.locale = locale;
        },
        country(state, country) {
            state.country = country;
        },
        orderNumber(state, orderNumber) {
            state.orderNumber = orderNumber;
        },
        currentFrame(state, currentFrame) {
            state.currentFrame = currentFrame;
        },
        error(state, error) {
            state.error = error;
        },
        hasCustomization(state, hasCustomization) {
            state.hasCustomization = hasCustomization;
        },
        hasPersonalization(state, hasPersonalization) {
            state.hasPersonalization = hasPersonalization;
        },
        hasSize(state, hasSize) {
            state.hasSize = hasSize;
        },
        ripeOptions(state, ripeOptions) {
            state.ripeOptions = ripeOptions;
        },
        ripeState(state, ripeState) {
            state.ripeState = ripeState;
        },
        initialsDataPromise(state, initialsDataPromise) {
            state.initialsDataPromise = initialsDataPromise;
        },
        initialsGroups(state, initialsGroups) {
            state.initialsGroups = initialsGroups;
        },
        initialsSupportedCharacters(state, initialsSupportedCharacters) {
            state.initialsSupportedCharacters = initialsSupportedCharacters;
        }
    },
    actions: {
        async getPersonalizationInfo({ state, commit }) {
            // in case a request is already ongoing
            // just reuse it
            if (state.initialsDataPromise) return state.initialsDataPromise;

            // if the data was already fetched
            // there is nothing to do
            if (state.initialsGroups && state.initialsSupportedCharacters) return;

            // runs the remote business logic to obtain the multiple
            // target groups available for initials as well as the
            // available characters for personalization
            const promise = Promise.all([
                this._vm.$ripe.runLogicP({ method: "groups" }),
                (async () => {
                    const supportedCharacters = await this._vm.$ripe.runLogicP({
                        method: "supported_characters"
                    });
                    return [...supportedCharacters];
                })()
            ]);

            // store the ongoing request so we
            // avoid redundant requests
            commit("initialsDataPromise", promise);

            try {
                const [groups, supportedCharacters] = await promise;
                commit("initialsGroups", groups);
                commit("initialsSupportedCharacters", supportedCharacters);
            } catch (err) {
                // gives a default group if builds does not support remote
                // business logic (for the `groups` and `supported_characters`
                // "methods")
                commit("initialsGroups", "main");
                commit("initialsSupportedCharacters", ["abcdefghijklmnopqrstvwxyz"]);
            } finally {
                commit("initialsDataPromise", null);
            }
        }
    },
    getters: {
        getParts: state => () => state.parts,
        getModelState: state => () => ({
            dku: state.dku,
            product_id: state.productId,
            brand: state.brand,
            model: state.model,
            variant: state.variant,
            version: state.version,
            flag: state.flag,
            format: state.format,
            resolution: state.resolution,
            background_color: state.backgroundColor,
            gender: state.gender,
            scale: state.scale,
            personalization: state.personalization,
            size: state.size,
            parts: state.parts
        }),
        getOrderInfo: state => () => {
            const orderInfo = {
                dku: state.dku,
                product_id: state.productId,
                brand: state.brand,
                model: state.model,
                gender: state.gender,
                scale: state.size.scale,
                size: state.size.size,
                variant: state.variant,
                version: state.version,
                parts: state.parts,
                country: state.country,
                currency: state.currency,
                store: state.store,
                account: state.account,
                customer: state.customerId
            };

            if (state.personalization.initials) {
                orderInfo.engraving = state.personalization.engraving;
                orderInfo.initials = state.personalization.initials;
                orderInfo.initials_extra = state.personalization.initialsExtra;
            }

            return orderInfo;
        },
        getCurrentFrame: state => () => state.currentFrame,
        getConfig: state => () => state.config,
        getFormat: state => () => state.format,
        getResolution: state => () => state.resolution,
        getBackgroundColor: state => () => state.backgroundColor,
        getTheme: state => () => state.theme,
        getRipeOptions: state => () => state.ripeOptions,
        getRipeState: state => () => state.ripeState,
        priceCurrency: state =>
            state.price && state.price.total ? state.price.total.currency : null,
        priceFinal: state =>
            state.price && state.price.total ? state.price.total.price_final : null,
        thumbnails: state => (state.config ? state.config.thumbnails || [] : [])
    }
};

export default store;
