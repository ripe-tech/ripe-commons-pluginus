import { storiesOf } from "@storybook/vue";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";

storiesOf("Atoms", module)
    .addDecorator(withKnobs)
    .add("Button", () => ({
        props: {
            text: {
                default: text("Text", "Create Order")
            },
            theme: {
                default: select(
                    "Theme",
                    {
                        default: "default",
                        black: "black"
                    },
                    "default"
                )
            },
            active: {
                default: boolean("Active", false)
            }
        },
        template: `
            <div>
                <button-ripe
                    v-bind:text="text"
                    v-bind:theme="theme"
                    v-bind:active="active" />
            </div>
        `
    }));
