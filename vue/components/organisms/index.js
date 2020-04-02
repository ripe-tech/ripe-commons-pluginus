import { Pickers } from "./pickers/pickers.vue";

const install = Vue => {
    Vue.component("pickers", Pickers);
};

export { Pickers };

export default install;
