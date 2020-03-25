import { storiesOf } from "@storybook/vue";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";

storiesOf("Atoms", module)
    .addDecorator(withKnobs)
    .add("Button", () => ({
        props: {
            text: {
                default: text("Text", "Button")
            },
            design: {
                default: select(
                    "Design",
                    {
                        Unset: null,
                        Default: "default"
                    },
                    null
                )
            },
            active: {
                default: boolean("Active", false)
            },
            loading: {
                default: boolean("Loading", false)
            }
        },
        template: `
            <button-ripe
                v-bind:text="text"
                v-bind:design="design"
                v-bind:active="active"
                v-bind:loading="loading"
            />
        `
    }));
