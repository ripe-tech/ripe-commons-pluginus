import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean, select, number } from "@storybook/addon-knobs";

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
                default: number("Size", 9)
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
