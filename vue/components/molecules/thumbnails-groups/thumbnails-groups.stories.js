import { storiesOf } from "@storybook/vue";
import Vuex from "vuex";
import { withKnobs } from "@storybook/addon-knobs";

storiesOf("Molecules", module)
    .addDecorator(withKnobs)
    .add("Thumbnails Groups", () => ({
        props: {
            groups: {
                type: Array,
                default: ["main"]
            },
            activeGroup: {
                type: String,
                default: "main"
            }
        },
        store: new Vuex.Store({
            state: {
                brand: "swear",
                model: "vyner",
                personalization: {
                    initials: "AB",
                    engraving: null,
                    initialsExtra: {
                        main: {
                            engraving: null,
                            initials: "AB"
                        }
                    }
                },
                config: {
                    initials: {
                        $alias: {
                            report: ["viewport::medium"],
                            "step::personalization": ["viewport::large"],
                            "step::size": ["viewport::medium"]
                        }
                    }
                }
            }
        }),
        mounted: async function() {
            await this.$ripe.config("swear", "vyner");
        },
        template: `
            <thumbnails-groups
                v-bind:size="204"
                v-bind:groups="groups"
                v-bind:active-group="activeGroup" />
        `
    }));
