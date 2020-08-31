import { Ripe } from "ripe-sdk";
import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class UrlChangerPlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.model = null;
        this.locale = null;
        this.theme = null;
        this.onModelChanged = this.owner.bind("model_changed", model =>
            this.updateQuery({ model: model })
        );
        this.onLocaleChanged = this.owner.bind("locale_changed", locale =>
            this.updateQuery({ locale: locale })
        );
        this.onThemeChanged = this.owner.bind("theme_changed", theme =>
            this.updateQuery({ theme: theme })
        );
        this.onUpdateQuery = this.owner.bind("update_query", () => this.updateQuery());
    }

    async unload() {
        this.owner.unbind("update_query", this.onUpdateQuery);
        this.owner.unbind("locale_changed", this.onLocaleChanged);
        this.owner.unbind("theme_changed", this.onThemeChanged);
        this.owner.unbind("model_changed", this.onModelChanged);
        await super.unload();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }

    updateQuery({ model = null, locale = null, theme = null } = {}) {
        this.model = model || this.model;
        this.locale = locale || this.locale;
        this.theme = theme || this.theme;

        // validates that the current model structure contains
        // a valid object structure and the model name is set,
        // this avoids unnecessary URL updates
        if (!this.model) return;
        if (!this.model.model) return;

        const query = this._generateQuery(this.model, this.locale, this.theme, false);
        const href = query ? "?" + query : "";
        window.history.replaceState({}, null, href);
    }

    _generateQuery(model, locale, theme, decode = true) {
        // retrieves the current search query value and parses it,
        // then unpacks the parts for the current model to be used
        // in the part triplets generation
        const search = window.location.search;
        const query = new URLSearchParams(search);
        const parts = model.parts || {};

        // a full query will be generated, so clear the parameters
        // that are exclusively used as entry points since they
        // aren't needed anymore and might be outdated with regards
        // to the current model configuration
        query.delete("dku");
        query.delete("product_id");

        if (model.brand) query.set("brand", model.brand);
        else query.delete("brand");

        if (model.model) query.set("model", model.model);
        else query.delete("model");

        if (model.variant) query.set("variant", model.variant);
        else query.delete("variant");

        if (model.version) query.set("version", model.version);
        else query.delete("version");

        if (model.flag) query.set("flag", model.flag);
        else query.delete("flag");

        if (locale) query.set("locale", locale);
        else query.delete("locale");

        if (theme && theme !== "default") query.set("theme", theme);
        else query.delete("theme");

        if (model.personalization) {
            if (model.personalization.initials) {
                query.set("initials", model.personalization.initials);
            } else {
                query.delete("initials");
            }

            if (model.personalization.engraving) {
                query.set("engraving", model.personalization.engraving);
            } else {
                query.delete("engraving");
            }

            query.delete("initials_extra");
            const initialsExtra = model.personalization.initialsExtra;
            if (initialsExtra) {
                for (const [key, value] of Object.entries(initialsExtra)) {
                    if (value.initials && !value.engraving) {
                        value.engraving = null;
                    }

                    if (!value.initials && value.engraving) {
                        delete initialsExtra[key];
                    }
                }

                const strInitialsExtra = new Ripe({ init: false })._generateExtraS(initialsExtra);
                for (const extraS of strInitialsExtra) {
                    query.append("initials_extra", extraS);
                }
            }
        }

        query.delete("p");
        for (const part in parts) {
            const value = parts[part];
            if (!value.material || !value.color) {
                continue;
            }
            const partQ = `${part}:${value.material}:${value.color}`;
            query.append("p", partQ);
        }

        this.owner.trigger("generate_query", query);

        const queryS = query.toString();
        return decode ? decodeURIComponent(queryS) : queryS;
    }
}

UrlChangerPlugin.register();
