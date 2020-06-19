const assert = require("assert");
const base = require("../../base");

describe("RestrictionsAlert", () => {
    it("should open on restrictions", () => {
        const component = base.getComponent("RestrictionsAlert");
        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", ["change1", "change2"]);
        assert.strictEqual(component.vm.$data.visible, true);

        component.vm.$bus.trigger("undo");
        assert.strictEqual(component.vm.$data.visible, false);
    });

    it("should not open without restrictions", () => {
        const component = base.getComponent("RestrictionsAlert");
        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", []);
        assert.strictEqual(component.vm.$data.visible, false);
    });

    it("should close on undo", () => {
        const component = base.getComponent("RestrictionsAlert");
        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", ["change1", "change2"]);
        assert.strictEqual(component.vm.$data.visible, true);

        component.vm.$bus.trigger("undo");
        assert.strictEqual(component.vm.$data.visible, false);
    });

    it("should close on no restrictions", () => {
        const component = base.getComponent("RestrictionsAlert");
        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", ["change1", "change2"]);
        assert.strictEqual(component.vm.$data.visible, true);

        component.vm.$bus.trigger("restrictions", []);
        assert.strictEqual(component.vm.$data.visible, false);
    });
});
