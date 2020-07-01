import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean, object } from "@storybook/addon-knobs";

storiesOf("Molecules", module)
    .addDecorator(withKnobs)
    .add("Keyboard", () => ({
        props: {
            keys: {
                default: object("Keys", [
                    ["a", "b", "c"],
                    ["d", "e", "😀", { name: "backspace", value: "backspace" }]
                ])
            },
            uppercase: {
                default: boolean("Uppercase", true)
            },
            singleChoice: {
                default: boolean("Single Choice", false)
            }
        },
        template: `
            <div>
                <keyboard
                    v-bind:keys="keys"
                    v-bind:uppercase="uppercase"
                    v-bind:single-choice="singleChoice" />
            </div>
        `
    }));
