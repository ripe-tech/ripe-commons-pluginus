require("core-js");
require("regenerator-runtime/runtime");
require("jsdom-global")(undefined, { url: "https://mock.ripe-pulse.platforme.com/" });
global.fetch = require("node-fetch");

const ripeCommons = require("..");
const pluginus = require("pluginus");

global.manager = pluginus.manager;
ripeCommons.registerPlugins(pluginus.manager);
