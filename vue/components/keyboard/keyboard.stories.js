import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean } from "@storybook/addon-knobs";

storiesOf("Molecules", module).addDecorator(withKnobs).add("Keyboard", () => ({
    props: {
        singleChoice: {
            default: boolean("Single Choice", false)
        }
    },
    template: `
        <div>
            <keyboard
                v-bind:single-choice="singleChoice"
                v-bind:keys="[['A', 'B', 'C'], ['D', 'E', '😀']]" />
        </div>
    `
}));
