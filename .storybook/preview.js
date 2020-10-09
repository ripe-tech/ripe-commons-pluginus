import Vue from "vue";
import Vuex from "vuex";
import { Ripe } from "ripe-sdk";

import { install as RipeCommonsPluginusVue, plugins } from "../vue";

import "./styles.css";

// makes use of Vuex to make use of things like
// data store (for some of the components)
Vue.use(Vuex);

// initializes the event bus that will be used for
// UI related communication between the components
Vue.use(plugins.busPlugin);

// initializes the main commons plugins structure
// registering all of its components
Vue.use(RipeCommonsPluginusVue);

// creates the RIPE instance that is going to be used
// through the Storybook "testing"
Vue.prototype.$ripe = new Ripe();
