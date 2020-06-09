import { storiesOf } from "@storybook/vue";
import { withKnobs } from "@storybook/addon-knobs";

storiesOf("Molecules", module)
    .addDecorator(withKnobs)
    .add("Messsages Alert", () => ({
        props: {
        },
        template: `
            <div>
                <messages-alert />
            </div>
        `
    }));
