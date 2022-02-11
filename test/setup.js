require("core-js");
require("regenerator-runtime/runtime");
require("jsdom-global")(undefined, { url: "https://mock.ripe-commons-pluginus.platforme.com/" });

global.__webpack_require__ = require;

module.exports = {
    loadFetch: async () => {
        // node-fetch uses ESM with an async import and so we need to patch
        // the current import operation to make it compatible with the new
        // async ESM driven approach
        const fetchPromise = import("node-fetch").then(mod => mod.default);
        global.fetch = (...args) => fetchPromise.then(fetch => fetch(...args));
    }
};
