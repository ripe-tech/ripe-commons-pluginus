<template>
    <component v-bind="$attrs" v-bind:is="component" v-on="$listeners">
        <slot />
    </component>
</template>

<script>
/**
 * The abstract component plugin that is meant to receive a certain
 * dynamic component and abstract it under a Vue.js component.
 *
 * This provides a simple bridge between Pluginus and Vue.js.
 */
export const ComponentPlugin = {
    name: "components-plugin",
    props: {
        name: {
            type: String,
            default: null
        },
        capability: {
            type: String,
            default: null
        }
    },
    data: function() {
        return {
            component: null
        };
    },
    computed: {
        componentGetter() {
            let functionName = "getComponent";
            if (this.capability) {
                functionName += this.capitalize(this.capability);
            }
            return functionName;
        }
    },
    created: async function() {
        const plugin = await this.getPlugin();
        if (!plugin) {
            throw new Error("Not plugin available for requested parameters");
        }
        this.component = await plugin[this.componentGetter]();
    },
    methods: {
        getPlugin() {
            if (this.name) {
                return this.manager.getPluginByName(this.name);
            } else if (this.capability) {
                return this.manager.getPluginByCapability("component-" + this.capability);
            } else {
                return this.manager.getPluginByCapability("component");
            }
        },
        capitalize(value) {
            if (!value) {
                return "";
            }

            return value[0].toUpperCase() + value.slice(1);
        }
    }
};

export default ComponentPlugin;
</script>
