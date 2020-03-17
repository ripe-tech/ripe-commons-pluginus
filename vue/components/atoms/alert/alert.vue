<template>
    <transition name="fade">
        <div class="alert" v-bind:style="style" v-show="isVisible">
            <global-events v-on:keydown.esc="handleGlobal" />
            <div class="alert-content">
                {{ textData }}
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.alert {
    background-color: #151515;
    box-shadow: 0px 0px 16px rgba(45, 58, 70, 0.25);
    box-sizing: border-box;
    cursor: pointer;
    display: block;
    font-size: 14px;
    font-weight: 500;
    left: calc(50% - 153px);
    padding: 16px 24px 16px 24px;
    position: absolute;
    text-align: center;
    top: calc(50% - 80px);
    width: 306px;
    z-index: 9;
}

.alert.fade-leave-active {
    animation: fade-shrink-visibility 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

.alert > .alert-content {
    color: #ffffff;
}
</style>

<script>
export const Alert = {
    name: "alert",
    props: {
        text: {
            type: String,
            default: "hello world"
        },
        visible: {
            type: Boolean,
            default: false
        },
        timeout: {
            type: Number,
            default: 1000
        },
        topHeight: {
            type: Number,
            default: 150
        },
        globalEvents: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        isVisible() {
            return this.visibleData;
        },
        style() {
            const base = {};
            if (this.topHeight !== null) base.top = `${this.topHeight}px`;
            return base;
        }
    },
    data: function() {
        return {
            visibleData: this.visible,
            globalEventsData: this.globalEvents,
            textData: this.text,
            timeoutData: this.timeoutData,
            timer: null,
            key: true
        };
    },
    watch: {
        text(value) {
            this.textData = value;
        },
        visible(value) {
            this.visibleData = value;
        },
        visibleData(value) {
            this.$emit("update:visible", value);
        }
    },
    mounted: function() {
        this.$bus.bind("alert", options => this.show(options));
        this.$bus.bind("hide-global", () => {
            if (!this.globalEventsData) return;
            this.hide();
        });
    },
    methods: {
        show(options) {
            const { text, timeout, globalEvents, reset = true } = options;

            this.textData = text;
            this.timeoutData = timeout || this.timeout;
            this.globalEventsData = globalEvents || this.globalEvents;

            if (this.visibleData) this.resetTimeout();
            this.visibleData = true;

            // alternate the key to force the component
            // to be destroyed and mounted again
            if (reset) this.reset();

            this.timer = setTimeout(() => {
                this.hide();
                this.reset();
            }, this.timeoutData);
        },
        hide() {
            if (!this.visibleData) return;
            this.visibleData = false;
        },
        reset() {
            this.key = !this.key;
        },
        resetTimeout() {
            if (this.timer) clearTimeout(this.timer);
        },
        handleGlobal() {
            if (!this.globalEvents) return;
            if (this.visibleData) this.resetTimeout();
            this.hide();
        }
    }
};

export default Alert;
</script>
