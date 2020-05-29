import { RipeCommonsPlugin, RipeCommonsCapability } from "../../abstract";
import { BaseSize } from "./base-size.vue";

export class BaseSizePlugin extends RipeCommonsPlugin {
    getCapabilities() {
        return [
            RipeCommonsCapability.new("component"),
            RipeCommonsCapability.new("component-size"),
            RipeCommonsCapability.new("size")
        ];
    }

    async getComponent() {
        return BaseSize;
    }

    async getComponentSize() {
        return BaseSize;
    }

    async getSizeComponent() {
        return BaseSize;
    }
}

BaseSizePlugin.register();
