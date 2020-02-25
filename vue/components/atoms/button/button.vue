<template>
    <button class="button" v-bind:class="classes" v-on:click="onClick">
        <slot>
            {{ text }}
        </slot>
    </button>
</template>

<style scoped>
.button {
    border: 1px solid #0d0d0d;
    cursor: pointer;
    font-size: 14px;
    max-width: 250px;
    outline: none;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    width: 100%;
}

.button.button-variant-default {
    color: #000000;
    font-family: Lato, "Open Sans", arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    height: 44px;
    letter-spacing: 0.25px;
    min-width: 100px;
    padding: 0px 20px 0px 20px;
}

.button.button-variant-default:hover {
    background-color: #0d0d0d;
    color: #ffffff;
}

.button.button-variant-black {
    background-color: #0d0d0d;
    border: 1px solid #0d0d0d;
    box-sizing: border-box;
    color: #ffffff;
    display: inline-block;
    font-family: MarkPro, sans-serif;
    font-size: 14px;
    font-weight: bold;
    height: 44px;
    letter-spacing: 1.17px;
    line-height: 44px;
    padding: 0px 20px 0px 20px;
}

.button.button-variant-black:hover {
    background-color: #444444;
    border-color: #444444;
}

.button:active {
    background-color: #2d2d2d;
    color: #ffffff;
}

.button.button-variant-default:active {
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
        mode: {
            type: String,
            default: "default"
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
            if (this.theme) base["button-variant-" + this.theme] = this.theme;
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
