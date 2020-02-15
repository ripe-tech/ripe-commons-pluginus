import { storiesOf } from "@storybook/vue";
import { withKnobs } from "@storybook/addon-knobs";

storiesOf("Molecules", module)
    .addDecorator(withKnobs)
    .add("Keyboard", () => ({
        props: {
        },
        template: `
            <div>
            </div>
        `
    }));
