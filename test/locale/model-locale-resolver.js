const assert = require("assert");

describe("ModelLocaleResolverPlugin", function() {
    it("localeColor", async () => {
        const localePlugin = await global.manager.getPluginByName("LocalePlugin");
        localePlugin.setLocale("en_us");
        localePlugin.setLocaleMap({
            en_us: {
                "builds.swear.colors.red": "Red",
                "builds.swear.colors.rubber.red": "Rubber Red",
                "builds.swear.colors.sole.rubber.red": "Sole Rubber Red"
            }
        });

        const plugin = await global.manager.getPluginByName("ModelLocaleResolverPlugin");
        plugin.brand = "swear";
        plugin.model = "vyner";
        assert.strictEqual("Red", plugin.localeColor("red"));
        assert.strictEqual(
            "Rubber Red",
            plugin.localeColor("red", { part: "front", material: "rubber" })
        );
        assert.strictEqual(
            "Sole Rubber Red",
            plugin.localeColor("red", { part: "sole", material: "rubber" })
        );
    });
});
