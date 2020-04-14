import Vue from "vue";
import { configure } from "@storybook/vue";

import { install as RipeCommonsPluginusVue, plugins } from "../vue";

import "./styles.css";

Vue.use(plugins.busPlugin);

Vue.use(RipeCommonsPluginusVue);

const req = require.context("../vue", true, /\.stories\.js$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
