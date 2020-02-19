import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean, object } from "@storybook/addon-knobs";

storiesOf("Molecules", module)
    .addDecorator(withKnobs)
    .add("Keyboard", () => ({
        props: {
            keys: {
                default: object("Keys", [
                    ["A", "B", "C"],
                    ["D", "E", "😀", { name: "backspace", value: "backspace" }]
                ])
            },
            singleChoice: {
                default: boolean("Single Choice", false)
            }
        },
        template: `
            <div>
                <keyboard
                    v-bind:keys="keys"
                    v-bind:single-choice="singleChoice" />
            </div>
        `
    }));
