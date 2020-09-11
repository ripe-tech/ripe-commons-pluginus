<template>
    <div class="suggestions-list">
        List of suggestions
    </div>
</template>

<style scoped></style>

<script>
export const SuggestionsList = {
    name: "suggestions-list",
    props: {
        queries: {
            type: Array,
            default: () => []
        }
    }
};

export default SuggestionsList;
</script>
