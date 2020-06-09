import { Ask } from "./ask/ask.vue";
import { ComponentPlugin } from "./component-plugin/component-plugin.vue";
import { Keyboard } from "./keyboard/keyboard.vue";
import { MessagesAlert } from "./messages-alert/messages-alert.vue";
import { Modal } from "./modal/modal.vue";
import { RestrictionsAlert } from "./restrictions-alert/restrictions-alert.vue";
import { Tab } from "./tabs/tab.vue";
import { Tabs } from "./tabs/tabs.vue";
import { Thumbnails } from "./thumbnails/thumbnails.vue";

const install = Vue => {
    Vue.component("ask", Ask);
    Vue.component("component-plugin", ComponentPlugin);
    Vue.component("keyboard", Keyboard);
    Vue.component("messages-alert", MessagesAlert);
    Vue.component("modal", Modal);
    Vue.component("restrictions-alert", RestrictionsAlert);
    Vue.component("tab", Tab);
    Vue.component("tabs", Tabs);
    Vue.component("thumbnails", Thumbnails);
};

export {
    Ask,
    ComponentPlugin,
    Keyboard,
    MessagesAlert,
    Modal,
    RestrictionsAlert,
    Tab,
    Tabs,
    Thumbnails
};

export default install;
