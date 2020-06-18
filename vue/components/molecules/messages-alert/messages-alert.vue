<template>
    <div class="messages-alert">
        <div class="message-messages-alert-container">
            <div class="message-messages-alert" v-bind:class="{ visible: messages.length > 0 }">
                <div class="button-container">
                    <a class="button button-messages-alert" v-on:click="undo">
                        {{ "ripe_commons.messages_alert.undo_button" | locale }}
                    </a>
                    <a class="button button-back" v-on:click="close">
                        {{ "ripe_commons.messages_alert.close_button" | locale }}
                    </a>
                </div>
                <div class="messages">
                    <div class="message" v-for="(message, index) in messages" v-bind:key="index">
                        <div class="name">
                            {{ `${message.name}:` | locale }}
                        </div>
                        <div class="value">
                            {{ message.value | locale}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.messages-alert .message-messages-alert-container {
    display: flex;
    flex-direction: row-reverse;
    overflow: hidden;
}

.messages-alert .message-messages-alert-container .message-messages-alert {
    align-items: center;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 10px 20px 10px 30px;
    text-align: left;
    z-index: 2;
}

body.mobile .messages-alert .message-messages-alert-container .message-messages-alert,
body.tablet .messages-alert .message-messages-alert-container .message-messages-alert {
    flex-direction: column-reverse;
    max-width: 70%;
}

.messages-alert .message-messages-alert .button-container {
    display: flex;
    flex-direction: row;
}

body.tablet .messages-alert .message-messages-alert .button-container,
body.mobile .messages-alert .message-messages-alert .button-container {
    justify-content: flex-end;
    width: 100%;
}

.messages-alert .message-messages-alert-container .message-messages-alert .button {
    align-items: center;
    border: none;
    cursor: pointer;
    display: flex;
    float: right;
    font-weight: 600;
    margin-left: 20px;
    padding: 10px 10px 10px 10px;
    text-decoration: underline;
    user-select: none;
}

.messages-alert .message-messages-alert-container .message-messages-alert .messages .message {
    margin: 0px 0px 10px 0px;
}

.messages-alert .message-messages-alert-container .message-messages-alert .messages .message:last-child {
    margin: 0px 0px 0px 0px;
}

.messages-alert .message-messages-alert-container .message-messages-alert .messages .message .name,
.messages-alert .message-messages-alert-container .message-messages-alert .messages .message .value {
    display: inline-block;
}

.messages-alert .message-messages-alert-container .message-messages-alert .messages .message .name {
    font-weight: 600;
    padding: 0px 2px 0px 0px;
    text-transform: capitalize;
}
</style>

<script>
export const MessagesAlert = {
    name: "messages-alert",
    data: function() {
        return {
            messages: []
        };
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
        undo() {
            this.close();
            this.$bus.trigger("undo");
        },
        close() {
            this.messages = [];
        }
    }
};
export default MessagesAlert;
</script>
