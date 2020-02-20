import { storiesOf } from "@storybook/vue";
import { withKnobs, text } from "@storybook/addon-knobs";

storiesOf("Atoms", module)
    .addDecorator(withKnobs)
    .add("Summary Details", () => ({
        props: {
            title: {
                default: text("Title", "customisation")
            },
            linkText: {
                default: text("Link Text", "Edit")
            },
            detailsInfo: {
                default: () => ({
                    name: "Obi-Wan Kenobi",
                    "e-mail": "obi-wan@platforme.com",
                    address: "221b Baker St, Marylebone, London NW1 6XE, United Kingdom"
                })
            }
        },
        template: `
            <div>
                <summary-details
                    v-bind:title="title"
                    v-bind:link-text="linkText"
                    v-bind:details-info="detailsInfo"
                />
            </div>
        `
    }));
