import { RipeCommonsPlugin, RipeCommonsCapability } from "../../abstract";
import { baseSize } from "./base-size.vue";

class BaseSizePlugin extends RipeCommonsPlugin {
    getCapabilities() {
        return [
            RipeCommonsCapability.new("component"),
            RipeCommonsCapability.new("component-size"),
            RipeCommonsCapability.new("size")
        ];
    }

    async getComponent() {
        return baseSize;
    }

    async getComponentSize() {
        return baseSize;
    }

    async getSizeComponent() {
        return baseSize;
    }
}

BaseSizePlugin.register();

export { BaseSizePlugin };
