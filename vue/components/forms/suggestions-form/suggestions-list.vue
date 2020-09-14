<template>
    <div class="suggestions-list">
        <div class="suggestion" v-for="suggestion in suggestions" v-bind:key="suggestion.model">
            <image-ripe class="thumbnail" v-bind:src="suggestion.imgUrl" />
            <div class="model">
                {{ suggestion.model }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.suggestions-list > .suggestion,
.suggestions-list > .suggestion > .thumbnail,
.suggestions-list > .suggestion > .model {
    display: inline-block;
    height: 100px;
    width: 100px;
}
</style>

<script>
export const SuggestionsList = {
    name: "suggestions-list",
    props: {
        queries: {
            type: Array,
            default: () => []
        }
    },
    data: function() {
        return {
            suggestions: []
        };
    },
    created: async function() {
        await this.loadSuggestions();
    },
    methods: {
        async loadSuggestions() {
            this.suggestions = await Promise.all(
                this.queries.map(async _query => {
                    const spec = this.$ripe._queryToSpec(_query);
                    const { query } = await this.$ripe.configInfoP(spec);
                    console.log("confQuery", query);

                    return { ...spec, imgUrl: `${this.$ripe.url}compose?${query}` };
                })
            );
        }
    }
};

export default SuggestionsList;
</script>
