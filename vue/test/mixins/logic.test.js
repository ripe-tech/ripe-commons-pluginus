const assert = require("assert");
const base = require("../base");

const logic = require("../../mixins/logic");

describe("logicMixin", () => {
    describe("#allPropertiesOrEmpty()", function() {
        it("should validate a simple scenario", async () => {
            const component = base.getComponent("RestrictionsAlert", {
                mixins: [logic.logicMixin]
            });

            assert.notStrictEqual(component, undefined);
            assert.notStrictEqual(component.vm.allPropertiesOrEmpty, undefined);

            assert.strictEqual(component.vm.allPropertiesOrEmpty(), true);

            assert.strictEqual(
                component.vm.allPropertiesOrEmpty(
                    ["main"],
                    { main: "hello" },
                    { main: { font: "yellow" } },
                    { font: ["yellow", "green"] }
                ),
                true
            );

            assert.strictEqual(
                component.vm.allPropertiesOrEmpty(
                    ["main"],
                    { main: "hello" },
                    { main: {} },
                    { font: ["yellow", "green"] }
                ),
                false
            );
        });
    });
});
