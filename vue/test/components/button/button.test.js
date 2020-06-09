const assert = require("assert");
const base = require("../../base");

describe("Button", () => {
    it("Has text", () => {
        const text = "This is text";
        const component = base.getComponent("Button", {
            props: { text: text }
        });
        assert.strictEqual(component.text(), text);
    });
});
