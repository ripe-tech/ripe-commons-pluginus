import { storiesOf } from "@storybook/vue";
import Vuex from "vuex";
import { withKnobs } from "@storybook/addon-knobs";

storiesOf("Molecules", module)
    .addDecorator(withKnobs)
    .add("Thumbnails Group", () => ({
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
                brand: "gucci",
                model: "wool_sweater",
                personalization: {
                    initialsExtra: {
                        sx: {
                            initials: "123",
                            engraving: "deco:font.outside:position.azzurro:style"
                        },
                        dx: {
                            initials: "abc",
                            engraving: "script:font.outside:position"
                        }
                    }
                },
                config: {
                    initials: {
                        properties: [
                            { name: "deco", type: "font" },
                            { name: "script", type: "font" },
                            { name: "outside", type: "position" },
                            { name: "oro", type: "style" },
                            { name: "argento", type: "style" },
                            { name: "verde", type: "style" },
                            { name: "rosa", type: "style" },
                            { name: "arancione", type: "style" },
                            { name: "azzurro", type: "style" }
                        ]
                    }
                }
            }
        }),
        template: `
            <div>
                <thumbnails-groups
                    v-bind:groups="groups"
                    v-bind:active-group="activeGroup" />
            </div>
        `
    }));
