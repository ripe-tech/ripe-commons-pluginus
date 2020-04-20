import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean, select } from "@storybook/addon-knobs";

storiesOf("Atoms", module)
    .addDecorator(withKnobs)
    .add("Dot", () => ({
        props: {
            color: {
                default: select(
                    "Color",
                    {
                        Red: "red",
                        Green: "green",
                        Blue: "blue",
                        Yellow: "yellow",
                        Orange: "orange",
                        Grey: "grey"
                    },
                    "grey"
                )
            },
            subtle: {
                default: boolean("Subtle", false)
            },
            size: {
                default: select(
                    "Size",
                    {
                        Tiny: "tiny",
                        Small: "small",
                        Medium: "medium",
                        Large: "large"
                    },
                    "medium"
                )
            }
        },
        template: `
            <dot
                v-bind:color="color"
                v-bind:subtle="subtle"
                v-bind:size="size"
            />
        `
    }));
