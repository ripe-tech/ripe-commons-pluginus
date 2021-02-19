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

    _bind() {
        this.owner.bind("config", config => {
            const { brand, name } = config || {};
            this.brand = brand;
            this.model = name;
        });
    }
}

ModelLocaleResolverPlugin.register();
