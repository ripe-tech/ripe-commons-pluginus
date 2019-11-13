<template>
    <div class="restrictionsAlert">
        <div class="message-restrictionsAlert-container">
            <div class="message-restrictionsAlert" v-bind:class="{ visible: visible }">
                <div class="button-container">
                    <a class="button button-restrictionsAlert" v-on:click="restrictionsAlert()">
                        {{ "ripe_commons.restrictionsAlert.restrictionsAlert" | locale }}
                    </a>
                    <a class="button button-back" v-on:click="close()">
                        {{ "ripe_commons.restrictionsAlert.back_button" | locale }}
                    </a>
                </div>
                <div class="message-container">
                    <span>
                        {{ "ripe_commons.restrictionsAlert.limited" | locale }}
                        {{ "ripe_commons.restrictionsAlert.back" | locale }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.restrictionsAlert .message-restrictionsAlert-container {
    display: flex;
    flex-direction: row-reverse;
    overflow: hidden;
}

.restrictionsAlert .message-restrictionsAlert-container .message-restrictionsAlert {
    align-items: center;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 10px 20px 10px 30px;
    text-align: left;
    z-index: 2;
}

body.mobile .restrictionsAlert .message-restrictionsAlert-container .message-restrictionsAlert,
body.tablet .restrictionsAlert .message-restrictionsAlert-container .message-restrictionsAlert {
    flex-direction: column-reverse;
    max-width: 70%;
}

.restrictionsAlert .message-restrictionsAlert .button-container {
    display: flex;
    flex-direction: row;
}

body.tablet .restrictionsAlert .message-restrictionsAlert .button-container,
body.mobile .restrictionsAlert .message-restrictionsAlert .button-container {
    justify-content: flex-end;
    width: 100%;
}

.restrictionsAlert .message-restrictionsAlert-container .message-restrictionsAlert .button {
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
export const restrictionsAlert = {
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
        restrictionsAlert() {
            this.visible = false;
            this.$bus.trigger("restrictionsAlert");
        },
        close() {
            this.visible = false;
        }
    }
};
export default restrictionsAlert;
</script>
