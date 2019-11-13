<template>
    <div class="restrictionAlerts">
        <div class="message-restrictionAlerts-container">
            <div class="message-restrictionAlerts" v-bind:class="{ visible: visible }">
                <div class="button-container">
                    <a class="button button-restrictionAlerts" v-on:click="restrictionAlerts()">
                        {{ "ripe_commons.restrictionAlerts.restrictionAlerts" | locale }}
                    </a>
                    <a class="button button-back" v-on:click="close()">
                        {{ "ripe_commons.restrictionAlerts.back_button" | locale }}
                    </a>
                </div>
                <div class="message-container">
                    <span>
                        {{ "ripe_commons.restrictionAlerts.limited" | locale }}
                        {{ "ripe_commons.restrictionAlerts.back" | locale }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.restrictionAlerts .message-restrictionAlerts-container {
    display: flex;
    flex-direction: row-reverse;
    overflow: hidden;
}

.restrictionAlerts .message-restrictionAlerts-container .message-restrictionAlerts {
    align-items: center;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 10px 20px 10px 30px;
    text-align: left;
    z-index: 2;
}

body.mobile .restrictionAlerts .message-restrictionAlerts-container .message-restrictionAlerts,
body.tablet .restrictionAlerts .message-restrictionAlerts-container .message-restrictionAlerts {
    flex-direction: column-reverse;
    max-width: 70%;
}

.restrictionAlerts .message-restrictionAlerts .button-container {
    display: flex;
    flex-direction: row;
}

body.tablet .restrictionAlerts .message-restrictionAlerts .button-container,
body.mobile .restrictionAlerts .message-restrictionAlerts .button-container {
    justify-content: flex-end;
    width: 100%;
}

.restrictionAlerts .message-restrictionAlerts-container .message-restrictionAlerts .button {
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
export const restrictionAlerts = {
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
        restrictionAlerts() {
            this.visible = false;
            this.$bus.trigger("restrictionAlerts");
        },
        close() {
            this.visible = false;
        }
    }
};
export default restrictionAlerts;
</script>
