import { Ripe } from "ripe-sdk";
import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

class UrlChangerPlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.model = null;
        this.onModelChanged = this.owner.bind("model_changed", model => this.updateQuery(model));
        this.onUpdateQuery = this.owner.bind("update_query", () => this.updateQuery());
    }

    async unload() {
        this.owner.unbind("update_query", this.onUpdateQuery);
        this.owner.unbind("model_changed", this.onModelChanged);
        await super.unload();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }

    updateQuery(model = null) {
        model = model || this.model;
        if (!model) return;

        this.model = model;

        const query = this._generateQuery(model, false);
        const href = query ? "?" + query : "";
        window.history.replaceState({}, null, href);
    }

    _generateQuery(model, decode = true) {
        const search = window.location.search;
        const query = new URLSearchParams(search);
        const parts = model.parts || {};

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

export { UrlChangerPlugin };
