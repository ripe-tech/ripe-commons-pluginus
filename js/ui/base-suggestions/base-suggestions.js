import { RipeCommonsPlugin, RipeCommonsCapability } from "../../abstract";
import { BaseSuggestions } from "./base-suggestions.vue";

export class BaseSuggestionsPlugin extends RipeCommonsPlugin {
    getCapabilities() {
        return [
            RipeCommonsCapability.new("component"),
            RipeCommonsCapability.new("component-suggestions"),
            RipeCommonsCapability.new("suggestions")
        ];
    }

    async getComponent() {
        return BaseSuggestions;
    }

    async getComponentSuggestions() {
        return BaseSuggestions;
    }

    async getSuggestionsComponent() {
        return BaseSuggestions;
    }
}

BaseSuggestionsPlugin.register();
