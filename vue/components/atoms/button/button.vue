<template>
    <button class="button" v-bind:class="classes" v-on:click="onClick">
        <slot>
            {{ text }}
        </slot>
    </button>
</template>

<style scoped>
.button {
    background-color: transparent;
    border: 1px solid #cccccc;
    cursor: pointer;
    font-size: 14px;
    outline: none;
}

.button.button-variant-default {
    border-radius: 2px 2px 2px 2px;
    font-family: Lato, "Open Sans", arial, sans-serif;
    font-weight: 500;
    min-width: 120px;
    padding: 6px 6px 6px 6px;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
}

.button:hover {
    border: 1px solid #2d2d2d;
}

.button:active {
    background-color: #2d2d2d;
    color: #ffffff;
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
        variant: {
            type: String,
            default: null
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            const base = {
                active: this.active
            };
            if (this.variant) base["button-variant-" + this.variant] = this.variant;
            return base;
        }
    },
    methods: {
        onClick(event) {
            this.$emit("click", event);
        }
    }
};

export default Button;
</script>
