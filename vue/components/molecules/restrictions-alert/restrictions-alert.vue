<template>
    <div class="restrictions-alert">
        <div class="message-restrictions-alert-container">
            <div class="message-restrictions-alert" v-bind:class="{ visible: visible }">
                <div class="button-container">
                    <a class="button button-restrictions-alert" v-on:click="undo">
                        {{ "ripe_commons.restrictions_alert.restrictions_alert" | locale }}
                    </a>
                    <a class="button button-back" v-on:click="close">
                        {{ "ripe_commons.restrictions_alert.close_button" | locale }}
                    </a>
                </div>
                <div class="message-container" v-bind:style="{width: messages.length > 0 ? '100%' : null}">
                    <div v-if="messages.length > 0">
                        <div class="messages" v-for="(message, index) in messages" v-bind:key="index">
                            <div class="name">
                                {{ `${message[0]}:` }}
                            </div>
                            <div class="value">
                                {{ message[1] }}
                            </div>
                        </div>
                    </div>
                    <span v-else>
                        {{ "ripe_commons.restrictions_alert.limited" | locale }}
                        {{ "ripe_commons.restrictions_alert.back" | locale }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.restrictions-alert .message-restrictions-alert-container {
    display: flex;
    flex-direction: row-reverse;
    overflow: hidden;
}

.restrictions-alert .message-restrictions-alert-container .message-restrictions-alert {
    align-items: center;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 10px 20px 10px 30px;
    text-align: left;
    z-index: 2;
}

body.mobile .restrictions-alert .message-restrictions-alert-container .message-restrictions-alert,
body.tablet .restrictions-alert .message-restrictions-alert-container .message-restrictions-alert {
    flex-direction: column-reverse;
    max-width: 70%;
}

.restrictions-alert .message-restrictions-alert .button-container {
    display: flex;
    flex-direction: row;
}

body.tablet .restrictions-alert .message-restrictions-alert .button-container,
body.mobile .restrictions-alert .message-restrictions-alert .button-container {
    justify-content: flex-end;
    width: 100%;
}

.restrictions-alert .message-restrictions-alert-container .message-restrictions-alert .button {
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

.restrictions-alert .message-restrictions-alert-container .message-restrictions-alert .message-container .messages .name,
.restrictions-alert .message-restrictions-alert-container .message-restrictions-alert .message-container .messages .value {
    display: inline-block;
}

.restrictions-alert .message-restrictions-alert-container .message-restrictions-alert .message-container .messages .name {
    font-weight: 600;
    padding: 0px 2px 0px 0px;
    text-transform: capitalize;
}
</style>

<script>
export const RestrictionsAlert = {
    name: "restrictions-alert",
    props: {
        defaultRestrictions: {
            type: Boolean,
            default: true
        }
    },
    data: function() {
        return {
            visible: false,
            messages: []
        };
    },
    mounted: function() {
        this.$bus.bind("restrictions", (changes, newPart) => {
            this.messages = [];
            this.visible = changes.length > 0;
        });

        this.$bus.bind("messages", messages => {
            if (messages.length === 0) return;

            this.messages = messages;
            this.visible = true;
        });
    },
    methods: {
        undo() {
            this.visible = false;
            this.$bus.trigger("undo");
        },
        close() {
            this.visible = false;
        }
    }
};
export default RestrictionsAlert;
</script>
