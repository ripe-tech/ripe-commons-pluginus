import { storiesOf } from "@storybook/vue";

storiesOf("Molecules", module).add("Keyboard", () => ({
    props: {},
    template: `
        <div>
            <keyboard v-bind:keys="[['A', 'B', 'C'], ['D', 'E', '😀']]" />
        </div>
    `
}));
