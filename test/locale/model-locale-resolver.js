const assert = require("assert");

describe("ModelLocaleResolverPlugin", function() {
    it("localeColor", async () => {
        const localePlugin = await global.manager.getPluginByName("LocalePlugin");
        localePlugin.setLocale("en_us");
        localePlugin.setLocaleMap({
            en_us: {
                "colors.red": "Red"
            }
        });

        const plugin = await global.manager.getPluginByName("ModelLocaleResolverPlugin");
        assert.strictEqual("Red", plugin.localeColor("red"));
    });
});
