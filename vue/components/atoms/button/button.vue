<template>
    <button class="button" v-bind:class="classes" v-on:click="onClick">
        <loader
            loader="ball-scale-multiple"
            class="loader"
            v-bind:loader-style="loaderStyle"
            v-show="loading"
        />
        <slot v-if="!loading">
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
    font-family: "Roboto", "Lato", "Open Sans", "arial", sans-serif;
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

.button.disabled {
    cursor: default;
    opacity: 0.4;
    pointer-events: none;
}

.button.button-design-default:active {
    background-color: #a5a5a5;
    color: #000000;
}

.button .loader {
    display: inline-block;
    transform: translateY(-21px);
    width: 32px;
}

.button ::v-deep .loader > div {
    background-color: transparent;
    height: 32px;
    left: 0px;
    width: 32px;
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
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        loaderStyle: {
            type: Object,
            default: () => ({})
        },
        href: {
            type: String,
            default: null
        },
        target: {
            type: String,
            default: null
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
                active: this.active,
                loading: this.loading,
                disabled: this.disabled
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
            if (this.disabled) return;
            if (this.href) {
                if (this.target) window.open(this.href, this.target);
                else document.location = this.href;
            }
            this.$emit("click", event);
        }
    }
};

export default Button;
</script>
