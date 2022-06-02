import { frameMixin } from "./frame";
import { loggingMixin } from "./logging";
import { logicMixin } from "./logic";
import { utilsMixin } from "./utils";

export * from "./device";
export * from "./frame";
export * from "./locale";
export * from "./logging";
export * from "./logic";
export * from "./modal";
export * from "./part";
export * from "./utils";

const install = Vue => {
    Vue.mixin(frameMixin);
    Vue.mixin(loggingMixin);
    Vue.mixin(logicMixin);
    Vue.mixin(utilsMixin);
};

export { install as installMixins };

export default install;
