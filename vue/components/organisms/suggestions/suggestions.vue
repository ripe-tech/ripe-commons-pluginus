<template>
    <div class="suggestions">
        <component v-bind:is="form" ref="form" />
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
    created: async function() {
        const plugins = await this.manager.getPluginsByCapability("suggestions");

        const form = await plugins[0].getSuggestionsComponent();
        this.form = form;
    }
};

export default Suggestions;
</script>
