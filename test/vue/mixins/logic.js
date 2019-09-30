const assert = require("assert");
const Vue = require("vue");

if (typeof window === "undefined") {
    global.window = {};
}

if (typeof document === "undefined") {
    global.document = {
        createElement: function() {
            return {
                setAttribute: function() {}
            };
        }
    };
}

if (typeof regeneratorRuntime === "undefined") {
    global.regeneratorRuntime = {
        mark: function() {}
    };
}

const ripeCommons = require("../../..");

describe("logicMixin", function() {
    describe("#diffInitialsExtra()", function() {
        it("should be able to compare initials extra", () => {
            const component = Vue.extend({
                mixins: [ripeCommons.logicMixin]
            })();

            assert.strictEqual(
                component.diffInitialsExtra(
                    {
                        main: { initials: "JM", engraving: "gold" }
                    },
                    {
                        main: { initials: "JM", engraving: "gold" }
                    }
                ),
                true
            );
        });
    });
});
