import { storiesOf } from "@storybook/vue";
import { withKnobs, text } from "@storybook/addon-knobs";

storiesOf("Atoms", module)
    .addDecorator(withKnobs)
    .add("Button", () => ({
        props: {
            text: {
                default: text("Text", "Button")
            }
        },
        template: `
            <div>
                <button-ripe v-bind:text="text" />
            </div>
        `
    }));
