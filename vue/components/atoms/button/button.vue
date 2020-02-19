<template>
    <button class="button" v-on:click="onClick">
        <slot>
            {{ text }}
        </slot>
    </button>
</template>

<style scoped>
.button {
    outline: none;
}
</style>

<script>
export const Button = {
    name: "button-ripe",
    props: {
        text: {
            type: String,
            default: ""
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    computed: {},
    methods: {
        onClick(event) {
            this.$emit("click", event);
        }
    }
};

export default Button;
</script>
