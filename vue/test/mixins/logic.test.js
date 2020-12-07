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

        it("should validate initials according to store", async () => {
            const component = base.getComponent("RestrictionsAlert", {
                mixins: [logic.logicMixin],
                store: {
                    state: {
                        initialsMinimumCharacters: 2,
                        initialsMaximumCharacters: 3,
                        initialsSupportedCharacters: ["a", "b", "c", "d"]
                    }
                }
            });

            assert.strictEqual(
                component.vm.allPropertiesOrEmpty(
                    ["main"],
                    { main: "a" },
                    { main: { font: "yellow" } },
                    { font: ["yellow", "green"] }
                ),
                false
            );

            assert.strictEqual(
                component.vm.allPropertiesOrEmpty(
                    ["main"],
                    { main: "ab" },
                    { main: { font: "yellow" } },
                    { font: ["yellow", "green"] }
                ),
                true
            );

            assert.strictEqual(
                component.vm.allPropertiesOrEmpty(
                    ["main"],
                    { main: "abc" },
                    { main: { font: "yellow" } },
                    { font: ["yellow", "green"] }
                ),
                true
            );

            assert.strictEqual(
                component.vm.allPropertiesOrEmpty(
                    ["main"],
                    { main: "abcd" },
                    { main: { font: "yellow" } },
                    { font: ["yellow", "green"] }
                ),
                false
            );

            assert.strictEqual(
                component.vm.allPropertiesOrEmpty(
                    ["main"],
                    { main: "ab!" },
                    { main: { font: "yellow" } },
                    { font: ["yellow", "green"] }
                ),
                false
            );
        });
    });
});
