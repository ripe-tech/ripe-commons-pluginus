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
        <div v-bind:class="'modal modal-' + name" v-show="visible" v-bind:id="'modal-' + name">
            <global-events v-on:keydown.esc="hide" />
            <div class="modal-background" v-on:click="backgroundLeave && hide()" />
            <div class="modal-container">
                <div class="button button-close" v-on:click="hide()">
                    <img src="~./assets/close.svg" />
                </div>
                <div class="modal-content">
                    <slot />
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.modal {
    bottom: 0px;
    left: 0px;
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

.modal > .modal-background {
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
    max-height: 80%;
    opacity: 1;
    overflow-y: auto;
    padding: 40px 40px 40px 40px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    transition: opacity 0.125s ease-out 0.125s, transform 0.25s ease-in-out 0.125s;
}

body.tablet .modal > .modal-container,
body.mobile .modal > .modal-container {
    box-sizing: border-box;
    max-height: 90%;
    max-width: 100%;
    padding: 20px 10px 20px 10px;
}

.modal > .modal-container > .button.button-close {
    background-color: #000000;
    color: #ffffff;
    cursor: pointer;
    display: none;
    left: 0px;
    margin: auto;
    padding: 5px 23px;
    position: absolute;
    text-align: left;
    top: 0px;
}

.modal > .modal-container > .button.button-close > img {
    height: 25px;
    margin: auto;
    vertical-align: middle;
    width: 25px;
}

body.mobile .modal > .modal-container > .button.button-close img {
    height: 15px;
    width: 15px;
}

body.mobile .modal .modal-content ::v-deep .title {
    font-size: 15px;
}

.modal.fade-enter > .modal-container,
.modal.fade-leave-to > .modal-container {
    opacity: 0;
    transform: translateY(-48%);
}

.modal.fade-enter-to > .modal-container {
    opacity: 1;
    transform: translateY(-50%);
}

.modal .modal-content {
    opacity: 1;
    transition: opacity 0.25s ease-in-out 0.125s;
}

.modal.fade-enter .modal-content,
.modal.fade-leave-to .modal-content {
    opacity: 0;
}

.modal.fade-enter-to .modal-content {
    opacity: 1;
}

.modal .modal-content ::v-deep .title {
    color: #272a2f;
    font-size: 30px;
    font-weight: normal;
    margin: 0px 0px 10px 0px;
}

.modal .modal-content ::v-deep .subtitle {
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
export const modal = {
    data: function() {
        return {
            options: {
                name: "",
                visible: false,
                backgroundLeave: true
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
        backgroundLeave() {
            return this.options.backgroundLeave;
        }
    },
    methods: {
        hide() {
            this.$emit("hide");
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

export default modal;
</script>
