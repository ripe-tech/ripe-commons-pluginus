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

    describe("#_permutations()", function() {
        it("should perform level-by-level permutation", async () => {
            const plugin = await this.ctx.manager.getPluginByName("ModelLocaleResolverPlugin");
            assert.deepStrictEqual(plugin._permutations("level1"), ["level1"]);
            assert.deepStrictEqual(plugin._permutations("level1.level2"), [
                "level1.level2",
                "level2"
            ]);
            assert.deepStrictEqual(plugin._permutations("level1.level2.level3"), [
                "level1.level2.level3",
                "level2.level3",
                "level3"
            ]);
            assert.deepStrictEqual(plugin._permutations("level1.level2.level3.level4"), [
                "level1.level2.level3.level4",
                "level2.level3.level4",
                "level3.level4",
                "level4"
            ]);
        });
    });
});
