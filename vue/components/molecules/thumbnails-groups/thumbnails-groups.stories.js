import { storiesOf } from "@storybook/vue";
import Vuex from "vuex";
import { withKnobs } from "@storybook/addon-knobs";

storiesOf("Molecules", module)
    .addDecorator(withKnobs)
    .add("Thumbnails Group", () => ({
        props: {
            groups: {
                type: Array,
                default: ["left", "right"]
            },
            activeGroup: {
                type: String,
                default: "left"
            }
        },
        store: new Vuex.Store({
            state: {
                brand: "sergio_rossi",
                model: "sr1_pump075",
                personalization: {},
                config: {
                    initials: {
                        $alias: {
                            report: ["viewport::medium"],
                            "report:crystal:left": ["viewport::crystal:left:medium"],
                            "report:crystal:right": ["viewport::crystal:right:medium"],
                            "report:left": ["viewport::left:medium"],
                            "report:right": ["viewport::right:medium"],
                            "step::personalization": ["viewport::large"],
                            "step::personalization:crystal:left": ["viewport::crystal:left:large"],
                            "step::personalization:crystal:right": [
                                "viewport::crystal:right:large"
                            ],
                            "step::personalization:left": ["viewport::left:large"],
                            "step::personalization:right": ["viewport::right:large"],
                            "step::size": ["viewport::medium"],
                            "step::size:crystal:left": ["viewport::crystal:left:medium"],
                            "step::size:crystal:right": ["viewport::crystal:right:medium"],
                            "step::size:left": ["viewport::left:medium"],
                            "step::size:right": ["viewport::right:medium"]
                        }
                    }
                }
            }
        }),
        template: `
                <thumbnails-groups
                    v-bind:size="204"
                    v-bind:groups="groups"
                    v-bind:active-group="activeGroup" />
        `
    }));
