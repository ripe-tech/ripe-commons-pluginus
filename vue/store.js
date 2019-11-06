import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        ripe_url: "",
        country: "",
        currency: "",
        locale: "",
        store: "",
        account: "",
        storeBrand: "",
        customerIdInput: false,
        customerId: "",
        brand: "",
        model: "",
        dku: "",
        product_id: "",
        variant: "",
        description: "",
        flag: "",
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
        orderNumber: null,
        currentFrame: null,
        error: null,
        detailsTitle: null,
        detailsContent: null,
        infoTitle: null,
        infoSubtitle: null,
        infoContent: null,
        next: null,
        labelNext: null,
        hasPersonalization: false,
        hasSize: false
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
            state.description = model.description;
            state.parts = model.parts;
        },
        flag(state, flag) {
            state.flag = flag;
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
        store_brand(state, storeBrand) {
            state.storeBrand = storeBrand;
        },
        store(state, store) {
            state.store = store;
        },
        customer_id_input(state, customerIdInput) {
            state.customerIdInput = customerIdInput;
        },
        customer_id(state, customerId) {
            state.customerId = customerId;
        },
        account(state, account) {
            state.account = account;
        },
        previous(state, previous) {
            state.previous = previous;
        },
        next(state, next) {
            state.next = next;
        },
        detailsTitle(state, detailsTitle) {
            state.detailsTitle = detailsTitle;
        },
        detailsContent(state, detailsContent) {
            state.detailsContent = detailsContent;
        },
        infoTitle(state, infoTitle) {
            state.infoTitle = infoTitle;
        },
        infoSubtitle(state, infoSubtitle) {
            state.infoSubtitle = infoSubtitle;
        },
        infoContent(state, infoContent) {
            state.infoContent = infoContent;
        },
        labelPrevious(state, labelPrevious) {
            state.labelPrevious = labelPrevious;
        },
        labelNext(state, labelNext) {
            state.labelNext = labelNext;
        },
        error(state, error) {
            state.error = error;
        },
        hasPersonalization(state, hasPersonalization) {
            state.hasPersonalization = hasPersonalization;
        },
        hasSize(state, hasSize) {
            state.hasSize = hasSize;
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
            flag: state.flag,
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
        priceCurrency: state =>
            state.price && state.price.total ? state.price.total.currency : null,
        priceFinal: state =>
            state.price && state.price.total ? state.price.total.price_final : null,
        thumbnails: state => (state.config ? state.config.thumbnails || [] : [])
    }
});

export default store;
