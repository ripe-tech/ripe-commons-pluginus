import { Ask } from "./ask/ask.vue";
import { ComponentPlugin } from "./component-plugin/component-plugin.vue";
import { Keyboard } from "./keyboard/keyboard.vue";
import { Modal } from "./modal/modal.vue";
import { RestrictionsAlert } from "./restrictions-alert/restrictions-alert.vue";
import { Tab } from "./tabs/tab.vue";
import { Table } from "./table/table.vue";
import { Tabs } from "./tabs/tabs.vue";
import { Thumbnails } from "./thumbnails/thumbnails.vue";

const install = Vue => {
    Vue.component("ask", Ask);
    Vue.component("component-plugin", ComponentPlugin);
    Vue.component("keyboard", Keyboard);
    Vue.component("modal", Modal);
    Vue.component("restrictions-alert", RestrictionsAlert);
    Vue.component("tab", Tab);
    Vue.component("table-ripe", Table);
    Vue.component("tabs", Tabs);
    Vue.component("thumbnails", Thumbnails);
};

export { Ask, ComponentPlugin, Keyboard, Modal, RestrictionsAlert, Tab, Table, Tabs, Thumbnails };

export default install;
