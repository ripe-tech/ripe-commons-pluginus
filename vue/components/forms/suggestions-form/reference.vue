<template>
    <div class="reference-suggestions">
        <suggestions-list v-bind:queries="queries" v-on:click:suggestion="onSuggestionClick" />
    </div>
</template>

<style scoped>
.suggestions-list {
    overflow-x: auto;
    white-space: nowrap;
}
</style>

<script>
import formInterface from "./interface.js";

export const Reference = {
    name: "reference",
    mixins: [formInterface],
    data: function() {
        return {
            artifact: null,
            queries: []
        };
    },
    created: async function() {
        this.artifact = await this.$ripe.getBuildArtifactP(this.brand, this.config.version);

        this.queries = this.getQueries();
    },
    methods: {
        onSuggestionClick(event, suggestion) {
            this.$emit("click:suggestion", event, suggestion);
        },
        getQueries() {
            const models = this.artifact.details.models.filter(model => model !== this.model);
            return models.map(model => `brand=${this.brand}&model=${model}`);
        }
    }
};

export default Reference;
</script>
