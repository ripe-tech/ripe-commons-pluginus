<template>
    <div class="restrictions-alert">
        <div class="message-restrictions-alert-container">
            <div class="message-restrictions-alert" v-bind:class="{ visible: visible }">
                <div class="button-container">
                    <a class="button button-restrictions-alert" v-on:click="restrictions-alert()">
                        {{ "ripe_commons.restrictions-alert.restrictions-alert" | locale }}
                    </a>
                    <a class="button button-back" v-on:click="close()">
                        {{ "ripe_commons.restrictions-alert.back_button" | locale }}
                    </a>
                </div>
                <div class="message-container">
                    <span>
                        {{ "ripe_commons.restrictions-alert.limited" | locale }}
                        {{ "ripe_commons.restrictions-alert.back" | locale }}
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
    cursor: pointer;
    float: right;
    font-weight: bold;
    margin-left: 20px;
    padding: 10px 10px 10px 10px;
    text-decoration: underline;
    user-select: none;
}
</style>

<script>
export const restrictions-alert = {
    data: function() {
        return {
            visible: false
        };
    },
    mounted: function() {
        this.$bus.bind("restrictions", (changes, newPart) => {
            this.visible = changes.length > 0;
        });
    },
    methods: {
        restrictions-alert() {
            this.visible = false;
            this.$bus.trigger("restrictions-alert");
        },
        close() {
            this.visible = false;
        }
    }
};
export default restrictions-alert;
</script>
