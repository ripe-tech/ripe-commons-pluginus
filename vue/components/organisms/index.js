import { Configurator } from "./configurator/configurator.vue";
import { Personalization } from "./personalization/personalization.vue";
import { Pickers } from "./pickers/pickers.vue";
import { Size } from "./size/size.vue";
import { Suggestions } from "./suggestions/suggestions.vue";

const install = Vue => {
    Vue.component("configurator", Configurator);
    Vue.component("personalization", Personalization);
    Vue.component("pickers", Pickers);
    Vue.component("size", Size);
    Vue.component("suggestions", Suggestions);
};

export { Configurator, Personalization, Pickers, Size, Suggestions };

export default install;
