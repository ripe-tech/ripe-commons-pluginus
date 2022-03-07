import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean } from "@storybook/addon-knobs";

const mockError = new TypeError("Mock error!", "mock.js");

storiesOf("Components/Atoms/Exception", module)
    .addDecorator(withKnobs)
    .add("Exception", () => ({
        props: {
            visible: {
                default: boolean("Logo", true)
            }
        },
        data: function() {
            return {
                mockError: mockError
            };
        },
        template: `
            <exception v-bind:error="mockError" v-bind:visible="visible" />
        `
    }));
