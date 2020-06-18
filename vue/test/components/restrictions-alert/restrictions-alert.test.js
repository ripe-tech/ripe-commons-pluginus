const assert = require("assert");
const base = require("../../base");

describe("Restrictions Alert", () => {
    it("Open on restrictions", () => {
        const component = base.getComponent("RestrictionsAlert");
        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", ["change1", "change2"]);
        assert.strictEqual(component.vm.$data.visible, true);

        component.vm.$bus.trigger("undo");
        assert.strictEqual(component.vm.$data.visible, false);
    });

    it("Doesn't open without restrictions", () => {
        const component = base.getComponent("RestrictionsAlert");
        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", []);
        assert.strictEqual(component.vm.$data.visible, false);
    });

    it("Closes on undo", () => {
        const component = base.getComponent("RestrictionsAlert");
        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", ["change1", "change2"]);
        assert.strictEqual(component.vm.$data.visible, true);

        component.vm.$bus.trigger("undo");
        assert.strictEqual(component.vm.$data.visible, false);
    });

    it("Closes on no restrictions", () => {
        const component = base.getComponent("RestrictionsAlert");
        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", ["change1", "change2"]);
        assert.strictEqual(component.vm.$data.visible, true);

        component.vm.$bus.trigger("restrictions", []);
        assert.strictEqual(component.vm.$data.visible, false);
    });
});
