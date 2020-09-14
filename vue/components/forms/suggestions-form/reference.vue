<template>
    <div class="reference-suggestions">
        <suggestions-list v-bind:queries="queries" />
    </div>
</template>

<style scoped></style>

<script>
export const Reference = {
    name: "reference",
    data: function() {
        return {
            artifact: null,
            queries: [
                "http://localhost:3000/?brand=sergio_rossi&model=sr1_running&locale=en_us&tech=1&version=118&p=sole%3Arubber_sr%3Ablack&p=front%3Aroyal_sr%3Ablack&p=back%3Aroyal_sr%3Ablack&p=tongue%3Aroyal_sr%3Ablack&p=side%3Atechnical_fabric_sr%3Ablack&p=loop%3Agrosgrain_sr%3Ablack&p=plate%3Ametal_sr%3Agold24&p=shadow%3Adefault%3Adefault",
                "http://localhost:3000/?brand=sergio_rossi&model=sr1_slipper"
            ]
        };
    },
    created: async function() {
        this.artifact = await this.$ripe.getBuildArtifactP(this.brand, 118);
    }
};

export default Reference;
</script>
