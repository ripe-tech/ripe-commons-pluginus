<template>
    <transition
        name="fade"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
        v-on:enter-cancelled="enterCancelled"
        v-on:before-leave="beforeLeave"
        v-on:leave="leave"
        v-on:after-leave="afterLeave"
        v-on:leave-cancelled="leaveCancelled"
    >
        <div
            v-bind:class="'modal' + (name ? ' modal-' + name : '')"
            v-show="visible"
            v-bind:id="name ? 'modal-' + name : null"
        >
            <global-events v-on:keydown.esc="hide" />
            <div class="modal-overlay" v-on:click="() => overlayLeave && hide(false)" />
            <div class="modal-container" ref="container">
                <div class="modal-header">
                    <slot name="header">
                        <div class="button button-close" v-on:click="() => hide(false)">
                            <img src="~./assets/close.svg" />
                        </div>
                    </slot>
                </div>
                <div class="modal-content">
                    <slot />
                </div>
                <div class="modal-footer">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.modal {
    align-items: center;
    bottom: 0px;
    display: flex;
    justify-content: center;
    left: 0px;
    line-height: initial;
    opacity: 1;
    position: fixed;
    right: 0px;
    text-align: center;
    top: 0px;
    transition: opacity 0.125s ease-in-out;
    z-index: 10;
}

.modal.fade-enter,
.modal.fade-leave-to {
    opacity: 0;
}

.modal.fade-leave-active {
    transition-delay: 0.25s;
}

.modal.fade-enter-to {
    opacity: 1;
}

.modal > .modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    left: 0px;
    position: absolute;
    top: 0px;
    width: 100%;
}

.modal > .modal-container {
    background-color: #ffffff;
    border-radius: 4px 4px 4px 4px;
    box-shadow: 0px 0px 12px #2d2d2d;
    display: inline-block;
    max-height: 95%;
    overflow-y: auto;
    padding: 0px 40px 0px 40px;
    transition: opacity 0.25s ease-out, transform 0.2s ease-out;
    z-index: 1;
}

body.tablet .modal > .modal-container,
body.mobile .modal > .modal-container {
    box-sizing: border-box;
    max-height: 98%;
    max-width: 100%;
    padding: 0px 10px 0px 10px;
}

.modal.fade-enter > .modal-container {
    opacity: 0;
    transform: translateY(5%);
}

.modal.fade-enter-to > .modal-container {
    opacity: 1;
    transform: translateY(0%);
}

.modal.fade-leave-active > .modal-container {
    transition: opacity 0.15s ease-out, transform 0.1s ease-out;
}

.modal.fade-leave-to > .modal-container {
    opacity: 0;
    transform: scale(0.97);
}

.modal > .modal-container > :nth-child(2) {
    padding-top: 40px;
}

body.tablet .modal > .modal-container > :nth-child(2),
body.mobile .modal > .modal-container > :nth-child(2) {
    padding-top: 20px;
}

.modal > .modal-container > :last-child {
    padding-bottom: 40px;
}

body.tablet .modal > .modal-container > :last-child,
body.mobile .modal > .modal-container > :last-child {
    padding-bottom: 20px;
}

.modal > .modal-container > .modal-header {
    margin-left: -40px;
    position: fixed;
}

body.tablet .modal > .modal-container > .modal-header,
body.mobile .modal > .modal-container > .modal-header {
    margin-left: -10px;
}

.modal > .modal-container > .modal-header > .button.button-close {
    background-color: #000000;
    color: #ffffff;
    cursor: pointer;
    display: none;
    margin: auto;
    padding: 5px 23px 5px 23px;
    text-align: left;
}

.modal > .modal-container > .modal-header > .button.button-close > img {
    height: 25px;
    margin: auto;
    vertical-align: middle;
    width: 25px;
}

body.mobile .modal > .modal-container > .modal-header > .button.button-close img {
    height: 15px;
    width: 15px;
}

.modal .modal-content ::v-deep > .title,
.modal .modal-content ::v-deep > div > .title,
.modal .modal-content ::v-deep > div > div > .title {
    color: #272a2f;
    font-size: 30px;
    font-weight: normal;
    margin: 0px 0px 10px 0px;
}

body.mobile .modal .modal-content ::v-deep > .title,
body.mobile .modal .modal-content ::v-deep > div > .title,
body.mobile .modal .modal-content ::v-deep > div > div > .title {
    font-size: 15px;
}

.modal .modal-content ::v-deep > .subtitle,
.modal .modal-content ::v-deep > div > .subtitle,
.modal .modal-content ::v-deep > div > div > .subtitle {
    color: #272a2f;
    font-size: 15px;
    margin: 0px 0px 0px 0px;
}

.modal .modal-content ::v-deep .buttons-container {
    text-align: right;
}

.modal .modal-content ::v-deep .buttons-container > .button {
    display: inline-block;
    font-size: 20px;
    height: 48px;
    line-height: 48px;
    text-align: center;
}

.modal .modal-content ::v-deep .buttons-container > .button.button-cancel {
    color: #9b9b9b;
    margin-right: 20px;
    padding: 0px 20px 0px 20px;
    transition: color 0.25s ease-in-out;
}

.modal .modal-content ::v-deep .buttons-container > .button.button-cancel:hover,
.modal .modal-content ::v-deep .buttons-container > .button.button-cancel:active {
    color: #000000;
}
</style>

<script>
export const Modal = {
    name: "modal",
    data: function() {
        return {
            options: {
                name: "",
                visible: false,
                overlayLeave: true
            }
        };
    },
    computed: {
        name() {
            return this.options.name;
        },
        visible() {
            return this.options.visible;
        },
        overlayLeave() {
            return this.options.overlayLeave;
        }
    },
    watch: {
        visible(value, previous) {
            if (!previous && value) {
                this.$nextTick(() => {
                    this.$refs.container.scrollTop = 0;
                });
            }
        }
    },
    methods: {
        hide(status) {
            this.$emit("hide", status);
        },
        keyPressed(key) {
            this.$emit("key_pressed");
        },
        beforeEnter() {
            this.$emit("before_enter");
        },
        enter() {
            this.$emit("enter");
        },
        afterEnter() {
            this.$emit("after_enter");
        },
        enterCancelled() {
            this.$emit("enter_cancelled");
        },
        beforeLeave() {
            this.$emit("before_leave");
        },
        leave() {
            this.$emit("leave");
        },
        afterLeave() {
            this.$emit("after_leave");
        },
        leaveCancelled() {
            this.$emit("leave_cancelled");
        }
    }
};

export default Modal;
</script>
