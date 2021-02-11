import { storiesOf } from "@storybook/vue";
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";

storiesOf("Components/Atoms/Button", module)
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
            disabled: {
                default: boolean("Disabled", false)
            },
            loading: {
                default: boolean("Loading", false)
            }
        },
        template: `
            <button-ripe
                v-bind:text="text"
                v-bind:design="design"
                v-bind:disabled="disabled"
                v-bind:active="active"
                v-bind:loading="loading"
            />
        `
    }));
