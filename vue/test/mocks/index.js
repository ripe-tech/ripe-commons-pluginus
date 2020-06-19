import filters from "./filters";
import mixins from "./mixins";

export const install = Vue => {
    Vue.use(filters);
    Vue.use(mixins);
};

export { filters, mixins };

export default install;
