<template>
    <div class="reference-suggestions">
        <suggestions-list v-bind:queries="queries" />
    </div>
</template>

<style scoped></style>

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
        this.artifact = await this.$ripe.getBuildArtifactP(this.brand, 118);

        this.queries = this.getQueries();
    },
    methods: {
        getQueries() {
            const models = this.artifact.details.models.filter(model => model !== this.model);
            return models.map(model => `brand=${this.brand}&model=${model}`);
        }
    }
};

export default Reference;
</script>
