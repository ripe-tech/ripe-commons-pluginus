import { Keyboard } from "./keyboard/keyboard.vue";
import { Modal } from "./modal/modal.vue";
import { Thumbnails } from "./thumbnails/thumbnails.vue";

const install = Vue => {
    Vue.component("keyboard", Keyboard);
    Vue.component("modal", Modal);
    Vue.component("thumbnails", Thumbnails);
};

export { Keyboard, Thumbnails };

export default install;
