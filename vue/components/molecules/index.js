import { Keyboard } from "./keyboard/keyboard.vue";

const install = Vue => {
    Vue.component("keyboard", Keyboard);
};

export { Keyboard };

export default install;
