import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

class ModelLocaleResolverPlugin extends RipeCommonsPlugin {
    constructor(owner) {
        super(owner);
        this._bind();
    }

    async load() {
        await super.load();
        this.localePlugin = await this.owner.getPluginByName("LocalePlugin");
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
        let value = [];
        value = value.concat(prefixes);
        part && material && color && value.push(`colors.${part}.${material}.${color}`);
        part && color && value.push(`colors.${part}.${color}`);
        material && color && value.push(`colors.${material}.${color}`);
        color && value.push(`colors.${color}`);
        value = value.concat(suffixes);
        return this.localeModel(value, {
            locale: locale,
            defaultValue: defaultValue
        });
    }

    localeMaterial(
        material,
        { part = null, locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}
    ) {
        let value = [];
        value = value.concat(prefixes);
        part && material && value.push(`materials.${part}.${material}`);
        material && value.push(`materials.${material}`);
        value = value.concat(suffixes);
        return this.localeModel(value, {
            locale: locale,
            defaultValue: defaultValue
        });
    }

    localePart(part, { locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}) {
        let value = [];
        value = value.concat(prefixes);
        part && value.push(`parts.${part}`);
        value = value.concat(suffixes);
        return this.localeModel(value, {
            locale: locale,
            defaultValue: defaultValue
        });
    }

    localeProperty(
        name,
        { type = null, locale = null, defaultValue = null, prefixes = [], suffixes = [] } = {}
    ) {
        let value = [];
        value = value.concat(prefixes);
        name && value.push(`properties.${name}`);
        type && name && value.push(`properties.${type}.${name}`);
        value = value.concat(suffixes);
        return this.localeModel(value, {
            locale: locale,
            defaultValue: defaultValue
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
        let values = Array.isArray(value) ? value : [value];
        if (values.length === 0) {
            throw new Error("No values present to be localized");
        }

        locale = locale || this.localePlugin.getLocale();
        let language = locale.split("_", 1)[0];
        if (hack) {
            value = values[-1].rsplit(".", 1)[-1];
            return this.localePlugin.toLocale(value, defaultValue, locale, fallback);
        }

        let locales = this.localePlugin.getSupportedLocales();
        if (locales.includes(locale)) {
        } else if (locales.includes(language)) {
            locale = language;
        } else if (fallback) {
            locale = locales[0];
        }

        let prefixes = [`${brand}.${model}`, brand];
        for (let value of values) {
            let permutations = this._permutations(value);
            for (let _prefix of prefixes) {
                for (let _value of permutations) {
                    let valueFqn = `${prefix}.${_prefix}.${_value}`;
                    let hasLocale = this.localePlugin.hasLocale(valueFqn, locale);
                    if (!hasLocale) {
                        continue;
                    }
                    let result = this.localePlugin.toLocale(valueFqn, null, locale, fallback);
                    if (result) {
                        return result;
                    }
                }
            }
        }

        if (compatibility) {
            for (let value of values) {
                let permutations = this._permutations(value);
                for (let _value of permutations) {
                    let hasLocale = this.localePlugin.hasLocale(_value, locale);
                    if (!hasLocale) {
                        continue;
                    }
                    let result = this.localePlugin.toLocale(_value, null, locale, fallback);
                    if (result) {
                        return result;
                    }
                }
            }
        }

        return defaultValue === null ? values[0] : defaultValue;
    }

    _permutations(value) {
        let valueP = value.split(".");
        let permutations = [];
        for (let index = valueP.length; index > 1; index--) {
            let parts = valueP.slice(1, index - 1);
            let partsS = parts.length ? parts.join(".") + "." : "";
            permutations.push(`${valueP[0]}.${partsS}${valueP[valueP.length - 1]}`);
        }
        return permutations;
    }
}

ModelLocaleResolverPlugin.register();

export { ModelLocaleResolverPlugin };
