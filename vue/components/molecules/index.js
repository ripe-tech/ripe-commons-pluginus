import { Ask } from "./ask/ask.vue";
import { ComponentPlugin } from "./component-plugin/component-plugin.vue";
import { Keyboard } from "./keyboard/keyboard.vue";
import { Modal } from "./modal/modal.vue";
import { RestrictionsAlert } from "./restrictions-alert/restrictions-alert.vue";
import { Tab } from "./tabs/tab.vue";
import { Tabs } from "./tabs/tabs.vue";
import { Thumbnails } from "./thumbnails/thumbnails.vue";
import { ThumbnailsGroups } from "./thumbnails-groups/thumbnails-groups.vue";

const install = Vue => {
    Vue.component("ask", Ask);
    Vue.component("component-plugin", ComponentPlugin);
    Vue.component("keyboard", Keyboard);
    Vue.component("modal", Modal);
    Vue.component("restrictions-alert", RestrictionsAlert);
    Vue.component("tab", Tab);
    Vue.component("tabs", Tabs);
    Vue.component("thumbnails", Thumbnails);
    Vue.component("thumbnails-groups", ThumbnailsGroups);
};

export {
    Ask,
    ComponentPlugin,
    Keyboard,
    Modal,
    RestrictionsAlert,
    Tab,
    Tabs,
    Thumbnails,
    ThumbnailsGroups
};

export default install;
