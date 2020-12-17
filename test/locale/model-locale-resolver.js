require("../setup");

const assert = require("assert");
const pluginus = require("pluginus");

const ripeCommons = require("../..");

describe("ModelLocaleResolverPlugin", function() {
    before(async function() {
        const manager = new pluginus.PluginManager();
        ripeCommons.registerPlugins(manager);

        const localePlugin = await manager.getPluginByName("LocalePlugin");
        localePlugin.setLocale("en_us");
        localePlugin.setLocaleMap({
            en_us: {
                "colors.red": "Red"
            }
        });

        this.manager = manager;
    });

    describe("#localeColor()", function() {
        it("should make a simple color translation", async () => {
            const plugin = await this.ctx.manager.getPluginByName("ModelLocaleResolverPlugin");
            assert.strictEqual("Red", plugin.localeColor("red"));
        });
    });
});
