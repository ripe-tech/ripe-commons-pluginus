<template>
    <div class="global">
        <slot name="before" />
        <alert />
        <ask v-bind:global="true" />
        <slot name="after" />
    </div>
</template>

<script>
import { utilsMixin } from "../../../mixins";

export const Global = {
    name: "global",
    mixins: [utilsMixin]
};

export default Global;
</script>
