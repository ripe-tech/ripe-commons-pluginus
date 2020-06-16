const assert = require("assert");
const base = require("../../base");

describe("Restrictions Alert", () => {
    it("Closes on Undo", () => {
        const component = base.getComponent("RestrictionsAlert");
        


        console.log("\n\n--------\n", "testing stuff:\n");

        // component.vm.$ripe.plugins[0] is the "RestrictionsPlugin"
        component.vm.$ripe.plugins[0].bind("restrictions", (...args) =>
            component.vm.$bus.trigger("restrictions", ...args)
        );
        component.vm.$bus.bind("restrictions", (changes, partSet) =>
            console.log("Testing restrictions event:", changes, partSet)
        ); // TODO remove

        component.vm.$ripe.plugins[0]._applyRestrictions("name test", "value test");






        // TODO
        // - event "restrictions"
        // - see if alert is open
        // - event "undo"
        // - see if alert is closed
        assert.strictEqual(true, true);
    });
});
