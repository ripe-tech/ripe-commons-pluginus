import { storiesOf } from "@storybook/vue";
import { withKnobs, text, boolean } from "@storybook/addon-knobs";

storiesOf("Components/Atoms/Button Platforme", module)
    .addDecorator(withKnobs)
    .add("Button Platforme", () => ({
        props: {
            normalText: {
                default: text("Text Normal", "Sign with Platforme ID")
            },
            loadingText: {
                default: text("Text Loading", "Loading...")
            },
            logo: {
                default: boolean("Logo", true)
            }
        },
        template: `
            <button-platforme
                v-bind:normal-text="normalText"
                v-bind:loading-text="loadingText"
                v-bind:logo="logo"
            />
        `
    }));
