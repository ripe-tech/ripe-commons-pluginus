import { deviceMockMixin } from "./device";
import { localeMockMixin } from "./locale";

export const install = Vue => {
    Vue.mixin(deviceMockMixin);
    Vue.mixin(localeMockMixin);
};

export { deviceMockMixin, localeMockMixin };

export default install;
