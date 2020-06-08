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
                <div class="message-container">
                    <span v-if="restrictions">
                        {{ "ripe_commons.restrictions_alert.limited" | locale }}
                        {{ "ripe_commons.restrictions_alert.back" | locale }}
                    </span>
                    <span v-if="messages.length > 0">
                        {{ messages }}
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
</style>

<script>
export const RestrictionsAlert = {
    name: "restrictions-alert",
    data: function() {
        return {
            restrictions: false,
            messages: []
        };
    },
    computed: {
        visible() {
            return this.restrictions || this.messages.length > 0;
        }
    },
    created: function() {
        this.onRestrictions = this.$bus.bind("restrictions", (changes, newPart) => {
            this.restrictions = changes.length > 0;
        });
        
        this.onMessage = this.$bus.bind("message", (name, value) => {
            this.messages.push({ name: name, value: value });
        });
    },
    destroyed: function() {
        if (this.onRestrictions) this.$bus.unbind("restrictions", this.onRestrictions);
        if (this.onMessage) this.$bus.unbind("message", this.onMessage);
    },
    methods: {
        undo() {
            this.restrictions = false;
            this.messages = [];
            this.$bus.trigger("undo");
        },
        close() {
            this.messages = [];
            this.restrictions = false;
        }
    }
};
export default RestrictionsAlert;
</script>
