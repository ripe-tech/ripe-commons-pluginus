import { Configurator } from "./configurator/configurator.vue";
import { Personalization } from "./personalization/personalization.vue";
import { Pickers } from "./pickers/pickers.vue";
import { Size } from "./size/size.vue";

const install = Vue => {
    Vue.component("configurator", Configurator);
    Vue.component("personalization", Personalization);
    Vue.component("pickers", Pickers);
    Vue.component("size", Size);
};

export { Configurator, Personalization, Pickers, Size };

export default install;
