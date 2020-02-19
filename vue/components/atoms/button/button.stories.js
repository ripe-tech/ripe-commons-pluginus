import { storiesOf } from "@storybook/vue";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";

storiesOf("Atoms", module)
    .addDecorator(withKnobs)
    .add("Button", () => ({
        props: {
            text: {
                default: text("Text", "Button")
            },
            variant: {
                default: select(
                    "Variant",
                    {
                        Unset: null,
                        Default: "default"
                    },
                    null
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
                    v-bind:variant="variant"
                    v-bind:active="active" />
            </div>
        `
    }));
