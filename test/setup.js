require("core-js");
require("regenerator-runtime/runtime");
require("jsdom-global")(undefined, { url: "https://mock.ripe-commons-pluginus.platforme.com/" });
global.fetch = require("node-fetch");

// workaround for 'self' not being populated with
// the fetch function
global.self = { fetch: fetch };
global.__webpack_require__ = require;
