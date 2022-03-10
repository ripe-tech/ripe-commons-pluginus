<template>
    <div class="section-expandable" v-bind:class="classes">
        <div class="header" v-on:click="onHeaderClick">
            <slot name="header">
                <div class="title" v-if="title">
                    {{ title }}
                </div>
            </slot>
            <slot name="icon">
                <icon
                    v-bind:icon="arrowIcon"
                    v-bind:color="'#000000'"
                    v-bind:width="14"
                    v-bind:height="14"
                    v-bind:stroke-width="3"
                />
            </slot>
        </div>
        <transition name="fade">
            <div class="content" v-show="expandedData">
                <slot />
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.section-expandable > .header {
    cursor: pointer;
    display: flex;
    padding: 20px 0px 20px 0px;
    transition: background-color 0.25 ease-in-out;
    user-select: none;
}

.section-expandable:hover > .header,
.section-expandable.expanded > .header {
    background-color: #f3f3f3;
}

.section-expandable > .header > .title {
    color: #000000;
    font-size: 16px;
    font-weight: 600;
}

.section-expandable > .header > .icon {
    align-items: center;
    display: none;
    margin-left: 15px;
}

.section-expandable > .header:hover > .icon {
    display: inline-flex;
}

.section-expandable > .content {
    overflow: hidden;
}

.section-expandable > .content.fade-enter-active,
.section-expandable > .content.fade-leave-active {
    transition: opacity 0.125s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.section-expandable > .content.fade-enter,
.section-expandable > .content.fade-leave-active {
    opacity: 0;
}
</style>

<script>
export const SectionExpandable = {
    name: "section-expandable",
    props: {
        title: {
            type: String,
            default: null
        },
        expanded: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            expandedData: this.expanded,
            expandedHeight: null
        };
    },
    computed: {
        classes() {
            const base = {};
            if (this.expandedData) base.expanded = true;
            return base;
        },
        arrowIcon() {
            return this.expandedData ? "chevron-up" : "chevron-down";
        }
    },
    watch: {
        expanded(value) {
            this.expandedData = value;
        },
        expandedData(value) {
            this.$emit("update:expanded", value);
        }
    },
    methods: {
        toggle() {
            this.expandedData = !this.expandedData;
        },
        expand() {
            this.expandedData = true;
        },
        collapse() {
            this.expandedData = false;
        },
        onHeaderClick() {
            this.toggle();
        }
    }
};

export default SectionExpandable;
</script>
