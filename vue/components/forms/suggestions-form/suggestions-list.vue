<template>
    <div class="suggestions-list">
        <div class="suggestion" v-for="suggestion in suggestions" v-bind:key="suggestion.model">
            <image-ripe
                class="thumbnail"
                v-bind:src="suggestion.imgUrl"
                v-bind:width="185"
                v-bind:height="185"
            />
            <div class="model">
                {{ suggestion.model }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.suggestions-list > .suggestion {
    display: inline-block;
    margin: 0px 40px 20px 40px;
    text-align: center;
}

.suggestions-list > .suggestion > .thumbnail {
    display: block;
}

.suggestions-list > .suggestion > .model {
    color: #d0cece;
    text-transform: uppercase;
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
    watch: {
        async queries() {
            await this.loadSuggestions();
        }
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

                    return { ...spec, imgUrl: `${this.$ripe.url}compose?${query}` };
                })
            );
        }
    }
};

export default SuggestionsList;
</script>
