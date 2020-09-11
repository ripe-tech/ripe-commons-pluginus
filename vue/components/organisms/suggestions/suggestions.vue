<template>
    <div class="suggestions">
        <component v-bind:is="form" ref="form" v-bind:key="formKey" />
    </div>
</template>

<style scoped></style>

<script>
export const Suggestions = {
    name: "suggestions",
    data: function() {
        return {
            form: null
        };
    },
    computed: {
        formKey() {
            return this.brand + "." + this.model + "." + this.counter;
        }
    },
    created: async function() {
        this.onPreConfig = this.$bus.bind("pre_config", () => (this.form = null));
        this.onPostConfig = this.$bus.bind("post_config", async config => {
            // in case there's no valid config for this post operation
            // returns control flow immediately, should not happen
            if (!config) {
                return;
            }

            // gathers the complete set of plugins registered for suggestions
            // sorts them according to the brand fitting property and then
            // retrieves the first plugin (best candidate)
            const plugins = (await this.manager.getPluginsByCapability("suggestions"))
                .filter(plugin => !plugin.meta.brand || plugin.meta.brand === this.brand)
                .map(plugin => (plugin.meta.brand === this.brand ? [1, plugin] : [0, plugin]))
                .sort((a, b) => b[0] - a[0])
                .map(v => v[1]);
            const plugin = plugins.length ? plugins[0] : null;

            // in case there's no valid size plugin available raises an error
            // indicating the issue with size loading
            if (!plugin) {
                throw new Error(`No size component found for ${this.brand}`);
            }

            // retrieves its suggestions component setting it as the form
            // component for this specific suggestions scenario
            const form = await plugin.getSuggestionsComponent();

            // increments the cache invalidation counter, internal hack to enable
            // proper computation of computed values
            this.counter += 1;

            // sets the form for the current component, sets it as enable and hidden
            // by default (initial state)
            this.form = form;
        });
    },
    destroyed: function() {
        if (this.onPostConfig) this.$bus.unbind("post_config", this.onPostConfig);
        if (this.onPreConfig) this.$bus.unbind("pre_config", this.onPreConfig);
    }
};

export default Suggestions;
</script>
