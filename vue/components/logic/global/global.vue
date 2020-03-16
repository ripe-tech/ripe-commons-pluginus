<template>
    <div class="global">
        <alert />
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
