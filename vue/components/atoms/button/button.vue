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
    background-color: #e5e5e5;
    border: none;
    border-radius: 4px 4px 4px 4px;
    font-family: Lato, "Open Sans", arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.25px;
    min-width: 100px;
    padding: 6px 10px 6px 10px;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
}

.button:hover {
    border: 1px solid #2d2d2d;
}

.button.button-variant-default:hover {
    border: none;
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
