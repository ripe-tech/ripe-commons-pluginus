import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class ModelLocaleResolverPlugin extends RipeCommonsPlugin {
    constructor(owner) {
        super(owner);
        this._bind();
    }

    async load() {
        await super.load();
        this.localePlugin = await this.owner.getPluginByName("LocalePlugin");
        this.ripeProvider = await this.owner.getPluginByCapability("ripe-provider");
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("locale-resolver")];
    }

    localeColor(
        color,
        {
            part = null,
            material = null,
            locale = null,
            defaultValue = null,
            prefixes = [],
            suffixes = []
        } = {}
    ) {
        const ripe = this.ripeProvider.ripe;
        return this.localeModel(color, {
            brand: this.brand,
            model: this.model,
            part: part,
            material: material,
            locale: locale,
            defaultValue: defaultValue,
            prefixes: prefixes,
            suffixes: suffixes,
            localeFunc: ripe.localeColor
        });
    }

    localeMaterial(
        material,
        { part = null, locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}
    ) {
        const ripe = this.ripeProvider.ripe;
        return this.localeModel(material, {
            brand: this.brand,
            model: this.model,
            part: part,
            locale: locale,
            defaultValue: defaultValue,
            prefixes: prefixes,
            suffixes: suffixes,
            localeFunc: ripe.localeMaterial
        });
    }

    localePart(part, { locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}) {
        const ripe = this.ripeProvider.ripe;
        return this.localeModel(part, {
            brand: this.brand,
            model: this.model,
            locale: locale,
            defaultValue: defaultValue,
            prefixes: prefixes,
            suffixes: suffixes,
            localeFunc: ripe.localePart
        });
    }

    localeProperty(
        name,
        { type = null, locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}
    ) {
        const ripe = this.ripeProvider.ripe;
        return this.localeModel(name, {
            brand: this.brand,
            model: this.model,
            type: type,
            locale: locale,
            defaultValue: defaultValue,
            prefixes: prefixes,
            suffixes: suffixes,
            localeFunc: ripe.localeProperty
        });
    }

    localeModel(value, { locale = null, defaultValue = null, localeFunc = null, ...options } = {}) {
        options = Object.assign(
            {
                locale: locale,
                defaultValue: defaultValue,
                localeFunc: localeFunc
            },
            options
        );
        return this._toLocale(value, this.brand, this.model, options);
    }

    _bind() {
        this.owner.bind("config", config => {
            const { brand, name } = config || {};
            this.brand = brand;
            this.model = name;
        });
    }

    _toLocale(
        value,
        brand,
        model,
        {
            locale = null,
            defaultValue = null,
            prefix = "builds",
            fallback = false,
            compatibility = true,
            hack = false,
            localeFunc = null,
            ...options
        } = {}
    ) {
        const ripe = this.ripeProvider.ripe;
        localeFunc = localeFunc || ripe.localeModel;
        const values = Array.isArray(value) ? value : [value];
        const result = localeFunc.call(ripe, value, this.localePlugin, {
            brand: brand,
            model: model,
            locale: locale,
            defaultValue: defaultValue,
            prefix: prefix,
            fallback: fallback,
            compatibility: compatibility,
            hack: hack,
            ...options
        });

        // if the localization was successful returns its result
        if (result !== defaultValue) return result;

        // if the localization was not successful but a default
        // was defined, then returns it
        if (defaultValue !== null) return result;

        // otherwise run the localization process again using
        // a fallback locale as the base for localization
        const localeFallback = this.localePlugin.getLocaleFallback();
        if (localeFallback !== locale) {
            return this._toLocale(values, brand, model, {
                locale: localeFallback,
                defaultValue: defaultValue,
                prefix: prefix,
                fallback: fallback,
                compatibility: compatibility,
                hack: hack,
                localeFunc: localeFunc,
                ...options
            });
        }

        return values[0];
    }
}

ModelLocaleResolverPlugin.register();
