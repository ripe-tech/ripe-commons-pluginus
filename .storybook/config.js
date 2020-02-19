import Vue from "vue";
import { configure } from "@storybook/vue";
import GlobalEvents from "vue-global-events";

import { install as RipeCommonsPluginusVue } from "../vue";

import "./styles.css";

Vue.use(RipeCommonsPluginusVue);
Vue.component("global-events", GlobalEvents);

Vue.prototype.$bus = new Vue();

const req = require.context("../vue", true, /\.stories\.js$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
