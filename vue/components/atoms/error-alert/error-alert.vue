<template>
    <transition name="fade">
        <div class="error-alert" v-bind:class="classes" v-show="isVisible">
            <div class="error-container">
                <div class="error-header" v-on:click="onHeaderClick">
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
                    <div class="error-stack" v-show="!isCollapsed">
                        <p
                            class="stack-line"
                            v-for="(stackLine, index) of stackLines"
                            v-bind:key="index"
                        >
                            {{ stackLine }}
                        </p>
                    </div>
                </transition>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.error-alert {
    color: #ffffff;
    display: block;
    font-family: "consolas", monospace;
    font-size: 12px;
    opacity: 1;
    transition: opacity 1s ease-in-out;
}

body.round .error-alert {
    border-radius: 4px 4px 4px 4px;
}

.error-alert > .error-container {
    display: flex;
    flex-direction: column;
}

.error-alert.direction-top > .error-container {
    display: flex;
    flex-direction: column-reverse;
}

.error-alert > .error-container > .error-header {
    background-color: #e96760;
    cursor: pointer;
    display: flex;
    font-weight: bold;
    padding: 8px 8px 8px 8px;
}

.error-alert > .error-container > .error-header > .left {
    display: inline-flex;
    justify-content: space-around;
    min-width: 150px;
    width: 100%;
}

.error-alert > .error-container > .error-header > .left .header-icon {
    align-items: center;
    display: inline-flex;
    max-height: 15px;
    padding-right: 4px;
}

.error-alert > .error-container > .error-header > .left .header-text {
    -webkit-box-orient: vertical;
    display: inline-block;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}

.error-alert.collapsed > .error-container > .error-header > .left .header-text {
    -webkit-line-clamp: 2;
}

.error-alert > .error-container > .error-header > .right {
    align-items: center;
    display: inline-flex;
    justify-content: space-around;
    max-height: 15px;
    min-width: 40px;
    width: 55px;
}

.error-alert > .error-container > .error-header > .right > .arrow {
    opacity: 0.6;
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.error-alert.collapsed > .error-container > .error-header > .right > .arrow {
    transform: rotate(180deg);
}

.error-alert > .error-container > .error-header > .right > .arrow:hover,
.error-alert > .error-container > .error-header .left:hover ~ .right .arrow {
    opacity: 1;
}

.error-alert > .error-container > .error-header > .right > .close {
    opacity: 0.6;
    transition: opacity 0.2s ease-in-out;
}

.error-alert > .error-container > .error-header > .right > .close:hover {
    opacity: 1;
}

.error-alert > .error-container > .error-stack {
    background-color: #e96760;
    max-height: 300px;
    overflow-x: auto;
    overflow-y: auto;
}

.error-alert > .error-container > .error-stack > .stack-line {
    margin: 0px;
    padding: 5px 8px 5px 26px;
}

.error-alert > .error-container > .error-stack > .stack-line:nth-child(odd) {
    background-color: #ec7a74;
}

.error-alert.fade-enter-active,
.error-alert.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.error-alert.fade-enter,
.error-alert.fade-leave-to {
    opacity: 0;
}

.error-alert > .error-container > .error-stack.fade-enter-active,
.error-alert > .error-container > .error-stack.fade-leave-active {
    transition: max-height 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

.error-alert > .error-container > .error-stack.fade-enter,
.error-alert > .error-container > .error-stack.fade-leave-to {
    max-height: 0px;
    opacity: 0.5;
}

body.mobile .error-alert > .error-container > .error-header > .right > .arrow,
body.tablet .error-alert > .error-container > .error-header > .right > .arrow {
    opacity: 1;
}

body.mobile .error-alert > .error-container > .error-header > .right > .close,
body.tablet .error-alert > .error-container > .error-header > .right > .close {
    opacity: 1;
}
</style>

<script>
export const ErrorAlert = {
    name: "error-alert",
    props: {
        errorObject: {
            type: Error,
            required: true
        },
        visible: {
            type: Boolean,
            default: true
        },
        collapsed: {
            type: Boolean,
            default: true
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
            if (this.errorData.lineNumber === undefined) return;
            if (this.errorData.columnNumber === undefined) return;
            return `${this.errorData.lineNumber}:${this.errorData.columnNumber}`;
        },
        stackLines() {
            return this.errorData.stack.split("\n");
        }
    },
    data: function() {
        return {
            errorData: this.errorObject,
            visibleData: this.visible,
            collapsedData: this.collapsed
        };
    },
    watch: {
        errorObject(value) {
            this.errorData = value;
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
            this.$emit("close");
            this.hide();
        },
        onHeaderClick() {
            this.collapsedData = !this.collapsedData;
        }
    }
};

export default ErrorAlert;
</script>
