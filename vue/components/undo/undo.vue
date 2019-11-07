<template>
    <div class="undo">
        <div class="message-undo-container">
            <div class="message-undo" v-bind:class="{ visible: allowUndo }">
                <div class="button-container">
                    <a class="button button-undo" v-on:click="undo()">
                        {{ "ripe_commons.pickers.undo" | locale }}
                    </a>
                    <a class="button button-undo button-back" v-bind:class="{ visible: allowBackButton }" v-on:click="close()">
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
.pickers .message-undo-container {
    display: flex;
    flex-direction: row-reverse;
    overflow: hidden;
}

.pickers .message-undo {
    border-radius: 5px;
    display: block;
    font-size: 14px;
    margin: 0px auto 0px auto;
    max-width: 780px;
    padding: 10px 20px 10px 30px;
    text-align: left;
    transform: translateY(-100%);
    transition: transform 0.5s ease-in-out;
}

.pickers .undo .message-undo.visible {
    align-items: center;
    background-color: #ffffff;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    transform: translateY(0px);
    z-index: 2;
}

body.tablet .pickers .undo .message-undo.visible,
body.mobile .pickers .undo .message-undo.visible {
    flex-direction: column-reverse;
}

.pickers .message-undo .button-container {
    display: flex;
    flex-direction: row;
}

body.tablet .undo .message-undo .button-container,
body.mobile .undo .message-undo .button-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.pickers .message-undo .button.button-undo {
    cursor: pointer;
    float: right;
    margin-left: 20px;
    margin-top: -10px;
    padding: 10px 10px 10px 10px;
    text-decoration: underline;
}
</style>

<script>
export const undo = {
    data: function() {
        return {
            allowUndo: false,
            allowBackButton: false
        };
    },
    mounted: function() {
        this.$bus.bind("restrictions", (changes, newPart) => {
            this.allowUndo = changes.length > 0;
        });
    },
    methods: {
        undo() {
            this.allowUndo = false;
            this.$bus.trigger("undo");
        },
        close() {
            this.allowUndo = false;
        }
    }
};
export default undo;
</script>
