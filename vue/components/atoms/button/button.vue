<template>
    <button class="button">
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
    methods: {}
};

export default Button;
</script>
