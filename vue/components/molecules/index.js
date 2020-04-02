import { ComponentPlugin } from "./component-plugin/component-plugin.vue";
import { Keyboard } from "./keyboard/keyboard.vue";
import { Modal } from "./modal/modal.vue";
import { Tab } from "./tabs/tab.vue";
import { Tabs } from "./tabs/tabs.vue";
import { Thumbnails } from "./thumbnails/thumbnails.vue";

const install = Vue => {
    Vue.component("component-plugin", ComponentPlugin);
    Vue.component("keyboard", Keyboard);
    Vue.component("modal", Modal);
    Vue.component("tab", Tab);
    Vue.component("tabs", Tabs);
    Vue.component("thumbnails", Thumbnails);
};

export { ComponentPlugin, Keyboard, Modal, Tab, Tabs, Thumbnails };

export default install;
