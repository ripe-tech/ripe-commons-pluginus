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
        return ripe.localeColor(color, this.localePlugin, {
            brand: this.brand,
            model: this.model,
            part: part,
            material: material,
            locale: locale,
            defaultValue: defaultValue,
            prefixes: prefixes,
            suffixes: suffixes
        });
    }

    localeMaterial(
        material,
        { part = null, locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}
    ) {
        const ripe = this.ripeProvider.ripe;
        return ripe.localeMaterial(material, this.localePlugin, {
            brand: this.brand,
            model: this.model,
            part: part,
            locale: locale,
            defaultValue: defaultValue,
            prefixes: prefixes,
            suffixes: suffixes
        });
    }

    localePart(part, { locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}) {
        const ripe = this.ripeProvider.ripe;
        return ripe.localePart(part, this.localePlugin, {
            brand: this.brand,
            model: this.model,
            locale: locale,
            defaultValue: defaultValue,
            prefixes: prefixes,
            suffixes: suffixes
        });
    }

    localeProperty(
        name,
        { type = null, locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}
    ) {
        const ripe = this.ripeProvider.ripe;
        return ripe.localeProperty(name, this.localePlugin, {
            brand: this.brand,
            model: this.model,
            type: type,
            locale: locale,
            defaultValue: defaultValue,
            prefixes: prefixes,
            suffixes: suffixes
        });
    }

    localeModel(value, { locale = null, defaultValue = null, ...options } = {}) {
        options = Object.assign(
            {
                locale: locale,
                defaultValue: defaultValue
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
            hack = false
        } = {}
    ) {
        const ripe = this.ripeProvider.ripe;
        const values = Array.isArray(value) ? value : [value];
        const result = ripe.localeModel(value, this.localePlugin, {
            brand: brand,
            model: model,
            locale: locale,
            defaultValue: defaultValue,
            prefix: prefix,
            fallback: fallback,
            compatibility: compatibility,
            hack: hack
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
                hack: hack
            });
        }

        return values[0];
    }
}

ModelLocaleResolverPlugin.register();
