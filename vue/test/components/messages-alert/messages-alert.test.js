const assert = require("assert");
const base = require("../../base");

describe("Messages Alert", () => {
    it('Clears on "config", "part", "initials" and "initials_extra" event', () => {
        const name = "test name";
        const value = "random test message";

        const component = base.getComponent("MessagesAlert");

        assert.strictEqual(component.vm.$data.messages.length, 0);

        component.vm.$bus.trigger("message", name, value);
        assert.strictEqual(component.vm.$data.messages.length, 1);

        component.vm.$bus.trigger("message", name, value);
        assert.strictEqual(component.vm.$data.messages.length, 2);

        component.vm.$bus.trigger("config");
        assert.strictEqual(component.vm.$data.messages.length, 0);

        component.vm.$bus.trigger("message", name, value);
        assert.strictEqual(component.vm.$data.messages.length, 1);

        component.vm.$bus.trigger("part");
        assert.strictEqual(component.vm.$data.messages.length, 0);

        component.vm.$bus.trigger("message", name, value);
        assert.strictEqual(component.vm.$data.messages.length, 1);

        component.vm.$bus.trigger("initials");
        assert.strictEqual(component.vm.$data.messages.length, 0);

        component.vm.$bus.trigger("message", name, value);
        assert.strictEqual(component.vm.$data.messages.length, 1);

        component.vm.$bus.trigger("initials_extra");
        assert.strictEqual(component.vm.$data.messages.length, 0);

        component.vm.$bus.trigger("message", name, value);
        assert.strictEqual(component.vm.$data.messages.length, 1);
    });

    it("Clears when the close button is clicked", () => {
        const name = "test name";
        const value = "random test message";

        const component = base.getComponent("MessagesAlert");

        assert.strictEqual(component.vm.$data.messages.length, 0);

        component.vm.$bus.trigger("message", name, value);
        assert.strictEqual(component.vm.$data.messages.length, 1);

        const closeButton = component.find(".button-back");
        closeButton.trigger("click");

        assert.strictEqual(component.vm.$data.messages.length, 0);
    });

    it('Triggers "undo" event when the undo button is clicked', () => {
        const name = "test name";
        const value = "random test message";
        let undoTriggered = false;

        const component = base.getComponent("MessagesAlert");

        component.vm.$bus.bind("undo", () => (undoTriggered = true));

        assert.strictEqual(component.vm.$data.messages.length, 0);

        component.vm.$bus.trigger("message", name, value);
        assert.strictEqual(component.vm.$data.messages.length, 1);

        const undoButton = component.find(".button-messages-alert");
        undoButton.trigger("click");

        assert.strictEqual(undoTriggered, true);
        assert.strictEqual(component.vm.$data.messages.length, 0);
    });
});
