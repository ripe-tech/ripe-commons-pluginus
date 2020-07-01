import { deviceMockMixin } from "./device";

export const install = Vue => {
    Vue.mixin(deviceMockMixin);
};

export { deviceMockMixin };

export default install;
