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
                    <span>
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
</style>

<script>
export const RestrictionsAlert = {
    name: "restrictions-alert",
    data: function() {
        return {
            visible: false
        };
    },
    created: function() {
        this.onRestrictions = this.$bus.bind("restrictions", (changes, newPart) => {
            this.visible = changes.length > 0;
        });

        this.onUndo = this.$bus.bind("undo", () => this.close());
    },
    destroyed: function() {
        if (this.onRestrictions) this.$bus.unbind("restrictions", this.onRestrictions);
        if (this.onUndo) this.$bus.unbind("undo", this.onUndo);
    },
    methods: {
        undo() {
            this.$bus.trigger("undo");
        },
        close() {
            this.visible = false;
        }
    }
};
export default RestrictionsAlert;
</script>
