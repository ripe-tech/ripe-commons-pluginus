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
        }
    }
};

export default Button;
</script>
