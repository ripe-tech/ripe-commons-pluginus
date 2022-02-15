require("core-js");
require("jsdom-global")(undefined, { url: "https://mock.ripe-commons-pluginus.platforme.com/" });
global.fetch = require("node-fetch");
