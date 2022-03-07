<template>
    <transition name="fade">
        <div class="exception" v-bind:class="classes" v-show="isVisible">
            <div class="exception-container">
                <div class="exception-header" v-on:click="onHeaderClick">
                    <div class="left">
                        <div class="header-icon">
                            <icon
                                v-bind:color="'#e96760'"
                                v-bind:fill="'#ffffff'"
                                v-bind:stroke-width="2"
                                v-bind:width="15"
                                v-bind:height="15"
                                v-bind:icon="'spam'"
                            />
                        </div>
                        <div class="header-text">
                            {{ message }} @ {{ file }}:{{ sourceLocation }}
                        </div>
                    </div>
                    <div class="right">
                        <icon
                            class="arrow"
                            v-bind:color="'#ffffff'"
                            v-bind:stroke-width="2"
                            v-bind:width="15"
                            v-bind:height="15"
                            v-bind:icon="'chevron-up'"
                        />
                        <icon
                            class="close"
                            v-bind:color="'#ffffff'"
                            v-bind:stroke-width="2"
                            v-bind:width="15"
                            v-bind:height="15"
                            v-bind:icon="'close'"
                            v-on:click.stop="onCloseClick"
                        />
                    </div>
                </div>
                <transition name="fade">
                    <div class="exception-stack" v-show="!isCollapsed">
                        <p class="stack-line" v-for="(stackLine, index) of stackLine" v-bind:key="index">
                            {{ stackLine }}
                        </p>
                    </div>
                </transition>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.exception {
    display: block;
    font-family: "consolas", monospace;
    transition: opacity 1s ease-in-out;
    background-color: #e96760;
    font-size: 12px;
    color: #ffffff;
    opacity: 1;
}

body.round .exception {
    border-radius: 4px 4px 4px 4px;
}

.exception > .exception-container {
    display: flex;
    flex-direction: column;
}

.exception.direction-top > .exception-container {
    display: flex;
    flex-direction: column-reverse;
}

.exception > .exception-container > .exception-header {
    display: flex;
    cursor: pointer;
    font-weight: bold;
    padding: 8px 8px 8px 8px;
}

.exception > .exception-container > .exception-header > .left {
    display: inline-flex;
    justify-content: space-around;
    width: 100%;
    min-width: 150px;
}

.exception > .exception-container > .exception-header > .left .header-icon {
    display: inline-flex;
    max-height: 15px;
    padding-right: 4px;
    align-items: center;
}

.exception > .exception-container > .exception-header > .left .header-text {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.exception.collapsed > .exception-container > .exception-header > .left .header-text {
    -webkit-line-clamp: 2;
}

.exception > .exception-container > .exception-header .right {
    display: inline-flex;
    width: 55px;
    min-width: 40px;
    max-height: 15px;
    justify-content: space-around;
    align-items: center;
}

.exception > .exception-container > .exception-header .arrow {
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    opacity: 0.6;
}

.exception.collapsed .exception-container .exception-header .arrow {
    transform: rotate(180deg);
}

.exception > .exception-container > .exception-header .arrow:hover,
.exception > .exception-container > .exception-header .left:hover ~ .right .arrow {
    opacity: 1;
}

.exception > .exception-container > .exception-header .right .close {
    transition: opacity 0.2s ease-in-out;
    opacity: 0.6;
}

.exception > .exception-container > .exception-header .right .close:hover {
    opacity: 1;
}

.exception > .exception-container > .exception-stack {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: auto;
}

.exception > .exception-container > .exception-stack > .stack-line {
    padding: 5px 8px 5px 26px;
    margin: 0px;
}

.exception > .exception-container > .exception-stack > .stack-line:nth-child(odd) {
    background-color: #ec7a74;
}

.exception.fade-enter-active,
.exception.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.exception.fade-enter,
.exception.fade-leave-to {
    opacity: 0;
}

.exception > .exception-header > .right .arrow.fade-enter-active,
.exception > .exception-header > .right .arrow.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.exception > .exception-header > .right .arrow.fade-enter,
.exception > .exception-header > .right .arrow.fade-leave-to {
    opacity: 0.5;
}

.exception > .exception-container > .exception-stack.fade-enter-active,
.exception > .exception-container > .exception-stack.fade-leave-active {
    transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

.exception > .exception-container > .exception-stack.fade-enter,
.exception > .exception-container > .exception-stack.fade-leave-to {
    max-height: 0px;
    opacity: 0;
}

body.mobile .exception > .exception-container > .exception-header .arrow {
    opacity: 1;
}

body.mobile .exception > .exception-container > .exception-header .right .close {
    opacity: 1;
}
</style>

<script>
import { partMixin } from "../../../mixins";

export const Exception = {
    name: "exception",
    mixins: [partMixin],
    props: {
        error: {
            type: Error,
            required: true
        },
        visible: {
            type: Boolean,
            default: true
        },
        collapsed: {
            type: Boolean,
            default: false
        },
        direction: {
            type: String,
            default: "bottom"
        }
    },
    computed: {
        classes() {
            const base = {};
            base.collapsed = this.isCollapsed;
            if (this.direction) {
                base[`direction-${this.direction}`] = true;
            }
            if (this.isMobileWidth()) {
                base["direction-top"] = true;
            }
            return base;
        },
        arrowIcon() {
            if (this.isCollapsed) {
                return "chevron-down";
            } else {
                return "chevron-up";
            }
        },
        isVisible() {
            return this.visibleData;
        },
        isCollapsed() {
            return this.collapsedData;
        },
        message() {
            return this.errorData.message;
        },
        file() {
            return this.errorData.fileName;
        },
        sourceLocation() {
            if (this.errorData.lineNumber === undefined || this.errorData.columnNumber === undefined) return;
            return `${this.errorData.lineNumber}:${this.errorData.columnNumber}`;
        },
        stackLine() {
            return this.errorData.stack.split("\n");
        }
    },
    data: function() {
        return {
            errorData: Error(this.error),
            visibleData: this.visible,
            collapsedData: this.collapsed
        };
    },
    watch: {
        error(value) {
            this.errorData = Error(value);
        },
        errorData(value) {
            this.$emit("update:error", value);
        },
        visible(value) {
            this.visibleData = value;
        },
        visibleData(value) {
            this.$emit("update:visible", value);
        },
        collapsed(value) {
            this.collapsedData = value;
        },
        collapsedData(value) {
            this.$emit("update:collapsed", value);
        }
    },
    methods: {
        show() {
            this.visibleData = true;
        },
        hide() {
            this.visibleData = false;
        },
        expand() {
            this.collapsedData = false;
        },
        collapse() {
            this.collapsedData = true;
        },
        onCloseClick() {
            this.hide();
        },
        onHeaderClick() {
            this.collapsedData = !this.collapsedData;
        }
    }
};

export default Exception;
</script>
