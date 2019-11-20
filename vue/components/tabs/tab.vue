<template>
    <div class="tab" v-bind:class="{ active: active }" v-on:click="$emit('selected')">
        <slot>
            <h1 class="default">{{ tab.title | locale }}</h1>
        </slot>
    </div>
</template>

<style scoped>
.tab {
    background-color: transparent;
    border: 1px solid transparent;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    cursor: pointer;
    display: inline-block;
    font-size: 15px;
    height: 100%;
    line-height: 100px;
    padding: 0px 20px;
    transition: background-color 0.125s ease-in-out;
    vertical-align: top;
}

.tab.active {
    background-color: #ffffff;
    border-color: #e9eaee #e9eaee transparent #e9eaee;
}

.tab > h1.default {
    font-size: 15px;
    text-transform: uppercase;
}
</style>

<script>
export const tab = {
    props: {
        tab: {
            type: Object,
            default: () => {}
        },
        active: {
            type: Boolean,
            default: true
        }
    }
};

export default tab;
</script>
