import Vue from "vue";
import { configure } from "@storybook/vue";

import { install as RipeCommonsPluginusVue } from "../vue";

import "./styles.css";

Vue.use(RipeCommonsPluginusVue);

Vue.prototype.$bus = new Vue();

const req = require.context("../vue", true, /\.stories\.js$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);