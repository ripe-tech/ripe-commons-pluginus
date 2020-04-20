<template>
    <div class="dot" v-bind:class="classes" v-bind:style="styles" v-on:click="onClick" />
</template>

<style lang="scss" scoped>
.dot {
    background-color: #5d5d5d;
    border: 1px solid #e9e9e9;
    border-radius: 50%;
    display: inline-block;
    font-size: 0px;
    height: 9px;
    transition: background-color 0.125s ease-in-out;
    width: 9px;
}

.dot.dot-dark {
    background-color: #151515;
}

.dot.dot-grey {
    background-color: #5d5d5d;
}

.dot.dot-red {
    background-color: #e96760;
}

.dot.dot-green {
    background-color: #45a777;
}

.dot.dot-blue {
    background-color: #4b8dd7;
}

.dot.dot-yellow {
    background-color: #ffd422;
}

.dot.dot-orange {
    background-color: #fb9032;
}

.dot.dot-dark.dot-subtle {
    background-color: #d8d8d8;
}

.dot.dot-grey.dot-subtle {
    background-color: #e2e2e2;
}

.dot.dot-red.dot-subtle {
    background-color: #f58a84;
}

.dot.dot-green.dot-subtle {
    background-color: #74dca9;
}

.dot.dot-blue.dot-subtle {
    background-color: #73b0f5;
}

.dot.dot-yellow.dot-subtle {
    background-color: #ffe473;
}

.dot.dot-orange.dot-subtle {
    background-color: #fbb766;
}
</style>

<script>
export const Dot = {
    name: "dot",
    props: {
        color: {
            type: String,
            default: null
        },
        subtle: {
            type: Boolean,
            default: false
        },
        size: {
            type: Number,
            default: null
        }
    },
    computed: {
        classes() {
            const base = {};
            if (this.color) base["dot-" + this.color] = this.color;
            if (this.subtle) base["dot-subtle"] = this.subtle;
            return base;
        },
        styles() {
            const base = {};
            if (this.size !== null) {
                base.height = `${this.size}px`;
                base.width = `${this.size}px`;
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

export default Dot;
</script>
