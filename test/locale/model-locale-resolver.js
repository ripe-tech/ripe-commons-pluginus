const assert = require("assert");

describe("ModelLocaleResolverPlugin", function() {
    it("localeColor", async () => {
        const localePlugin = await global.manager.getPluginByName("LocalePlugin");
        localePlugin.setLocale("en_us");
        localePlugin.setLocaleMap({
            en_us: {
                "colors.red": "Red",
                "colors.rubber.red": "Rubber Red",
                "colors.sole.rubber.red": "Sole Rubber Red"
            }
        });

        const plugin = await global.manager.getPluginByName("ModelLocaleResolverPlugin");
        assert.strictEqual("Red", plugin.localeColor("red"));
        assert.strictEqual("Rubber Red", plugin.localeColor("red", { part: "front", material: "rubber" }));
        assert.strictEqual("Sole Rubber Red", plugin.localeColor("red", { part: "sole", material: "rubber" }));
    });
});
