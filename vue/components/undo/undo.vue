<template>
    <div class="undo">
        <div class="message-undo-container">
            <div class="message-undo" v-bind:class="{ visible: visible }">
                <div class="button-container">
                    <a class="button button-undo" v-on:click="undo()">
                        {{ "ripe_commons.pickers.undo" | locale }}
                    </a>
                    <a class="button button-back" v-on:click="close()">
                        {{ "ripe_commons.pickers.back_button" | locale }}
                    </a>
                </div>
                <div class="message-container">
                    <span>
                        {{ "ripe_commons.pickers.limited" | locale }}
                        {{ "ripe_commons.pickers.back" | locale }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.undo .message-undo-container {
    display: flex;
    flex-direction: row-reverse;
    overflow: hidden;
}

.undo .message-undo-container .message-undo.visible {
    align-items: center;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    left: 0;
    max-width: 50%;
    padding: 10px 20px 10px 30px;
    position: absolute;
    right: 0;
    text-align: left;
    top: 90px;
    transform: translateY(0px);
    z-index: 2;
}

body.mobile .undo .message-undo-container .message-undo.visible,
body.tablet .undo .message-undo-container .message-undo.visible {
    flex-direction: column-reverse;
    max-width: 70%;
}

.undo .message-undo .button-container {
    display: flex;
    flex-direction: row;
}

body.tablet .undo .message-undo .button-container,
body.mobile .undo .message-undo .button-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.undo .message-undo-container .message-undo .button {
    cursor: pointer;
    float: right;
    font-weight: bold;
    margin-left: 20px;
    padding: 10px 10px 10px 10px;
    text-decoration: underline;
}

.undo .message-undo-container .message-undo .button-back {
    display: none;
}
</style>

<script>
export const undo = {
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
        undo() {
            this.visible = false;
            this.$bus.trigger("undo");
        },
        close() {
            this.visible = false;
        }
    }
};
export default undo;
</script>
