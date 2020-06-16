const assert = require("assert");
const base = require("../../base");

describe("Restrictions Alert", () => {
    it("Closes on Undo", () => {
        const component = base.getComponent("RestrictionsAlert");
        
        console.log("\n\n--------testing stuff:\n");
        console.log("ripe:", component.vm.$ripe)
        console.log("bus:", component.vm.$bus)






        // TODO
        // - event "restrictions"
        // - see if alert is open
        // - event "undo"
        // - see if alert is closed
        assert.strictEqual(true, true);
    });
});
