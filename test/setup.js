require("core-js");
require("regenerator-runtime/runtime");
require("jsdom-global")(undefined, { url: "https://mock.ripe-pulse.platforme.com/" });
global.fetch = require("node-fetch");
