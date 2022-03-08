import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean } from "@storybook/addon-knobs";

const mockError = new TypeError("Mock error!", "mock.js");

storiesOf("Components/Atoms/Error Alert", module)
    .addDecorator(withKnobs)
    .add("Error Alert", () => ({
        props: {
            visible: {
                default: boolean("Visible", true)
            },
            collapsed: {
                default: boolean("Collapsed", false)
            }
        },
        data: function() {
            return {
                mockError: mockError
            };
        },
        template: `
            <error-alert
                v-bind:error="mockError"
                v-bind:visible="visible"
                v-bind:collapsed="collapsed"
            />
        `
    }));
