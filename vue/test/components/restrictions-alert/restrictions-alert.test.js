const assert = require("assert");
const base = require("../../base");

describe("Restrictions Alert", () => {
    it("Closes on Undo", () => {
        const changes = ["change1", "change2"];
        const partSet = null;

        const component = base.getComponent("RestrictionsAlert");

        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", changes, partSet);
        assert.strictEqual(component.vm.$data.visible, true);

        component.vm.$bus.trigger("undo");
        assert.strictEqual(component.vm.$data.visible, false);
    });

    it('Doesn\'t open when an "restrictions" event with no changes is triggered', () => {
        const changes = [];
        const partSet = null;

        const component = base.getComponent("RestrictionsAlert");

        assert.strictEqual(component.vm.$data.visible, false);

        component.vm.$bus.trigger("restrictions", changes, partSet);
        assert.strictEqual(component.vm.$data.visible, false);
    });
});
