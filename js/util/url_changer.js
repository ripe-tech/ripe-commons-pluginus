import { Ripe } from "ripe-sdk";
import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

class UrlChangerPlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.handler = this.owner.bind("model_changed", model => this.updateQuery(model));
    }

    async unload() {
        this.owner.unbind("model_changed", this.handler);
        await super.unload();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }

    updateQuery(model) {
        const href = this._generateQuery(model);
        window.history.replaceState({}, null, href);
    }

    _generateQuery(model) {
        let href = window.location.search;
        const query = new URLSearchParams(href);
        const parts = model.parts || {};

        if (model.brand) query.set("brand", model.brand);
        else query.delete("brand");

        if (model.model) query.set("model", model.model);
        else query.delete("model");

        if (model.variant) query.set("variant", model.variant);
        else query.delete("variant");

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

            if (model.personalization.initialsExtra) {
                const strInitialsExtra = new Ripe()._generateExtraS(
                    model.personalization.initialsExtra
                );
                for (const extraS of strInitialsExtra) {
                    query.append("initials_extra", extraS);
                }
            } else query.delete("initials_extra");
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
        href =
            Array.from(query.entries()).length > 0
                ? "?" + decodeURIComponent(query.toString())
                : "";
        return href;
    }
}

UrlChangerPlugin.register(global.manager);

export { UrlChangerPlugin };
