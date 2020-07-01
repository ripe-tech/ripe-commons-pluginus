export const localeMixin = {
    computed: {
        __localeModel() {
            return this.manager.pluginsName.ModelLocaleResolverPlugin;
        }
    },
    methods: {
        localeModel(part, material, color, options) {
            options = Object.assign(
                {
                    part: part,
                    material: material
                },
                options
            );
            if (!this.__localeModel) {
                return options.defaultValue || "";
            }
            if (color) {
                return this.__localeModel.localeColor(color, options);
            } else if (material) {
                return this.__localeModel.localeMaterial(material, options);
            } else if (part) {
                return this.__localeModel.localePart(part, options);
            }
        },
        localeModelProperty(name, type, options) {
            options = Object.assign(
                {
                    type: type
                },
                options
            );
            if (!this.__localeModel) {
                return options.defaultValue || "";
            }
            return this.__localeModel.localeProperty(name, options);
        },
        localeEngraving(engraving, separator = " ") {
            if (!this.config || !this.config.initials) return engraving;
            const { values } = this.$ripe.parseEngraving(
                engraving,
                this.config.initials.properties
            );
            return values
                .map(property => this.localeModelProperty(property.name, property.type))
                .filter(localizedProperty => localizedProperty.length)
                .join(separator);
        }
    }
};
