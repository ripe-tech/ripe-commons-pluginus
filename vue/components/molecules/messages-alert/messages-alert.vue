<template>
    <transition
        name="slide-transition"
        v-on:before-enter="onSlideTransitionBeforeEnter"
        v-on:after-leave="onSlideTransitionAfterLeave"
    >
        <div class="messages-alert" v-show="visible">
            <div class="messages">
                <div class="message" v-for="(message, index) in visibleMessages" v-bind:key="index">
                    <div class="name">
                        {{ `${message.name}:` }}
                    </div>
                    <div class="value">
                        {{ message.value }}
                    </div>
                </div>
            </div>
            <div class="buttons">
                <div class="undo" v-on:click="undo">
                    {{ "ripe_commons.messages_alert.undo_button" | locale }}
                </div>
                <div class="close" v-on:click="close">
                    {{ "ripe_commons.messages_alert.close_button" | locale }}
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.messages-alert {
    align-items: center;
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: 0px 8px 12px 0px rgba(98, 110, 117, 0.15);
    display: flex;
    left: 0px;
    margin: auto;
    padding: 16px 20px 16px 20px;
    position: fixed;
    right: 0px;
    top: 90px;
    transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1),
        opacity 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: fit-content;
    z-index: 3;
}

.messages-alert.slide-transition-enter,
.messages-alert.slide-transition-leave-to {
    opacity: 0;
    top: 0px;
}

.messages-alert.slide-transition-enter-to {
    top: 90px;
}

.messages-alert > .messages {
    margin: 0px 16px 0px 0px;
}

.messages-alert > .messages > .message {
    margin: 0px 0px 10px 0px;
}

.messages-alert > .messages > .message:last-child {
    margin: 0px 0px 0px 0px;
}

.messages-alert > .messages > .message > .name,
.messages-alert > .messages > .message > .value {
    display: inline-block;
}

.messages-alert > .messages > .message > .name {
    font-weight: 600;
    padding: 0px 2px 0px 0px;
    text-transform: capitalize;
}

.messages-alert > .buttons > .undo,
.messages-alert > .buttons > .close {
    color: #5d5d5d;
    cursor: pointer;
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    margin: 0px 5px 0px 5px;
    text-decoration: underline;
    user-select: none;
}

.messages-alert > .buttons > .undo:hover,
.messages-alert > .buttons > .close:hover {
    color: #000000;
}

.messages-alert > .buttons > .undo:active,
.messages-alert > .buttons > .close:active {
    color: #737373;
}
</style>

<script>
export const MessagesAlert = {
    name: "messages-alert",
    data: function() {
        return {
            messages: [],
            allowVisible: true,
            visibleMessages: []
        };
    },
    computed: {
        visible() {
            return this.messages.length > 0 && this.allowVisible;
        }
    },
    created: function() {
        this.onMessage = this.$bus.bind("message", (name, value) => {
            this.messages.push({ name: name, value: value });
        });
        this.onConfig = this.$bus.bind("config", () => this.close());
        this.onPart = this.$bus.bind("part", () => this.close());
        this.onInitials = this.$bus.bind("initials", () => this.close());
        this.onInitialsExtra = this.$bus.bind("initials_extra", () => this.close());
    },
    destroyed: function() {
        if (this.onInitialsExtra) this.$bus.unbind("initials_extra", this.onInitialsExtra);
        if (this.onInitials) this.$bus.unbind("initials", this.onInitials);
        if (this.onPart) this.$bus.unbind("part", this.onPart);
        if (this.onConfig) this.$bus.unbind("config", this.onConfig);
        if (this.onMessage) this.$bus.unbind("message", this.onMessage);
    },
    methods: {
        onSlideTransitionBeforeEnter() {
            this.visibleMessages = [...this.messages];
        },
        onSlideTransitionAfterLeave() {
            this.allowVisible = true;
        },
        undo() {
            this.close();
            this.$bus.trigger("undo");
        },
        close() {
            this.allowVisible = !this.visible;
            this.messages = [];
        }
    }
};
export default MessagesAlert;
</script>
