export const store = {
    state: {
        ripe_url: "",
        country: "",
        currency: "",
        locale: "",
        brand: "",
        model: "",
        dku: "",
        product_id: "",
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
        initialsGroups: [],
        initialsSupportedCharacters: []
    },
    mutations: {
        ripe_url(state, url) {
            state.ripe_url = url;
        },
        model(state, model) {
            state.brand = model.brand;
            state.model = model.model;
            state.dku = model.dku;
            state.product_id = model.product_id;
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
            state.personalization.initials = value.initials;
            state.personalization.engraving = value.engraving;
            state.personalization.initialsExtra = value.initialsExtra;
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
        order_number(state, orderNumber) {
            state.orderNumber = orderNumber;
        },
        current_frame(state, currentFrame) {
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
        initialsGroups(state, initialsGroups) {
            state.initialsGroups = initialsGroups;
        },
        initialsSupportedCharacters(state, initialsSupportedCharacters) {
            state.initialsSupportedCharacters = initialsSupportedCharacters;
        }
    },
    getters: {
        getParts: state => () => state.parts,
        getModelState: state => () => ({
            dku: state.dku,
            product_id: state.product_id,
            brand: state.brand,
            model: state.model,
            variant: state.variant,
            version: state.version,
            flag: state.flag,
            format: state.format,
            resolution: state.resolution,
            backgroundColor: state.backgroundColor,
            gender: state.gender,
            scale: state.scale,
            personalization: state.personalization,
            size: state.size,
            parts: state.parts
        }),
        getOrderInfo: state => () => {
            const orderInfo = {
                dku: state.dku,
                product_id: state.product_id,
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
