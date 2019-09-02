import { RipeCommonsPlugin, RipeCommonsCapability } from "../../abstract";
import { header } from "./header.vue";

class HeaderPlugin extends RipeCommonsPlugin {
    getCapabilities() {
        return [
            RipeCommonsCapability.new("component"),
            RipeCommonsCapability.new("component-header")
        ];
    }

    async getComponent() {
        return header;
    }

    async getComponentHeader() {
        return header;
    }
}

HeaderPlugin.register();

export { HeaderPlugin };
