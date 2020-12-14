const ripeCommons = require("../..");

describe("ModelLocaleResolverPlugin", function() {
    it("should be able to run simple tests", () => {
        const plugin = new ripeCommons.ModelLocaleResolverPlugin();
        assert.strictEqual("hello", plugin.localeColor("red"));
    });
});
