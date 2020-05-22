import { RipeCommonsPlugin, RipeCommonsCapability } from "../../abstract";
import { BasePersonalization } from "./base-personalization.vue";

class BasePersonalizationPlugin extends RipeCommonsPlugin {
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

export { BasePersonalizationPlugin };
