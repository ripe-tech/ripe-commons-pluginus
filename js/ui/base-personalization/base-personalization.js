import { RipeCommonsPlugin, RipeCommonsCapability } from "../../abstract";
import { BasePersonalization } from "./base-personalization.vue";

export class BasePersonalizationPlugin extends RipeCommonsPlugin {
    constructor(owner) {
        super(owner);
        this.version = "0.1.0";
    }

    getCapabilities() {
        return [
            RipeCommonsCapability.new("component"),
            RipeCommonsCapability.new("component-personalization"),
            RipeCommonsCapability.new("personalization")
        ];
    }

    async getComponent() {
        return BasePersonalization;
    }

    async getPersonalizationComponent() {
        return BasePersonalization;
    }
}

BasePersonalizationPlugin.register();
