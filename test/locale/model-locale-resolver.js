require("../setup");

const assert = require("assert");
const pluginus = require("pluginus");
const ripe = require("ripe-sdk").ripe;

const ripeCommons = require("../..");

class RipeProviderPlugin extends ripeCommons.RipeCommonsPlugin {
    async load() {
        await super.load();
        this.ripe = new ripe.Ripe({ init: false });
    }

    async unload() {
        await super.unload();
        this.ripe = null;
    }

    getCapabilities() {
        return [ripeCommons.RipeCommonsCapability.new("ripe-provider")];
    }
}

describe("ModelLocaleResolverPlugin", function() {
    before(async function() {
        const manager = new pluginus.PluginManager();
        ripeCommons.registerPlugins(manager);
        RipeProviderPlugin.register(manager);

        const localePlugin = await manager.getPluginByName("LocalePlugin");
        localePlugin.setLocale("en_us");
        localePlugin.setLocaleMap({
            en_us: {
                "builds.swear.colors.red": "Red",
                "builds.swear.colors.rubber.red": "Rubber Red",
                "builds.swear.colors.sole.rubber.red": "Sole Rubber Red"
            }
        });

        this.manager = manager;
    });

    describe("#localeColor()", function() {
        it("should make a simple color translation", async () => {
            const plugin = await this.ctx.manager.getPluginByName("ModelLocaleResolverPlugin");
            plugin.brand = "swear";
            plugin.model = "vyner";
            assert.strictEqual("Red", plugin.localeColor("red"));
            assert.strictEqual(
                plugin.localeColor("red", { part: "front", material: "rubber" }),
                "Rubber Red"
            );
            assert.strictEqual(
                plugin.localeColor("red", { part: "sole", material: "rubber" }),
                "Sole Rubber Red"
            );
        });
    });
});
