import { Configurator } from "./configurator/configurator.vue";
import { Pickers } from "./pickers/pickers.vue";

const install = Vue => {
    Vue.component("configurator", Configurator);
    Vue.component("pickers", Pickers);
};

export { Configurator, Pickers };

export default install;
