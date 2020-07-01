import Vue from "vue";
import { configure } from "@storybook/vue";

import { install as RipeCommonsPluginusVue, plugins } from "../vue";

import "./styles.css";

// initializes the event bus that will be used for
// UI related communication between the components
Vue.use(plugins.busPlugin);

// initializes the main commons plugins structure
// registering all of its components
Vue.use(RipeCommonsPluginusVue);

const req = require.context("../vue", true, /\.stories\.js$/);
function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
