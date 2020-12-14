const assert = require("assert");

describe("ModelLocaleResolverPlugin", function() {
    before(async function() {
        const localePlugin = await global.manager.getPluginByName("LocalePlugin");
        localePlugin.setLocale("en_us");
        localePlugin.setLocaleMap({
            en_us: {
                "colors.red": "Red"
            }
        });
    });

    describe("#localeColor()", function() {
        it("should make a simple color translation", async () => {
            const plugin = await global.manager.getPluginByName("ModelLocaleResolverPlugin");
            assert.strictEqual("Red", plugin.localeColor("red"));
        });
    });
});
