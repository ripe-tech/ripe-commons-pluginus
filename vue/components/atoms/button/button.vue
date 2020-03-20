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

.button.button-design-default {
    background-color: #e5e5e5;
    border: none;
    border-radius: 4px 4px 4px 4px;
    color: #000000;
    font-family: Lato, "Open Sans", arial, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.25px;
    min-width: 100px;
    padding: 6px 10px 6px 10px;
}

.button.button-alignment-left {
    text-align: left;
}

.button.button-alignment-right {
    text-align: right;
}

.button:hover {
    border: 1px solid #2d2d2d;
}

.button.button-design-default:hover {
    border: none;
}

.button:active {
    background-color: #2d2d2d;
    color: #ffffff;
}

.button.button-design-default:active {
    background-color: #a5a5a5;
    color: #000000;
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
        design: {
            type: String,
            default: null
        },
        alignment: {
            type: String,
            default: null
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        alignmentStyle() {
            if (this.alignment) return this.alignment;
            if (this.icon) return "right";
            return "center";
        },
        classes() {
            const base = {
                active: this.active
            };
            if (this.design) base["button-design-" + this.design] = this.design;
            if (this.alignmentStyle) {
                base["button-alignment-" + this.alignmentStyle] = this.alignmentStyle;
            }
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
