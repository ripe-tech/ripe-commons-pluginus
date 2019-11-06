<template>
    <div class="undo">
        <div class="message-undo-container">
            <div class="message-undo" v-bind:class="{ visible: allowUndo }">
                <div class="button-container">
                    <a class="button button-undo" v-on:click="undo()">
                        {{ "ripe_commons.pickers.undo" | locale }}
                    </a>
                    <a class="button button-undo button-back" v-on:click="undo()">
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

.undo .message-undo {
    background-color: #ffffff;
    border-radius: 5px;
    display: block;
    font-size: 14px;
    margin: 0px auto 0px auto;
    max-width: 790px;
    padding: 10px 20px 10px 30px;
    text-align: left;
    transform: translateY(-100%);
    transition: transform 0.5s ease-in-out;
}

body.tablet .undo .message-undo {
    max-width: 580px;
}

.undo .message-undo.visible {
    align-items: center;
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 90px;
    transform: translateY(0px);
}

body.tablet .undo .message-undo.visible,
body.mobile .undo .message-undo.visible {
    flex-direction: column-reverse;
}

body.tablet .undo .message-undo .button-container,
body.mobile .undo .message-undo .button-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

.undo .message-undo .button-container .button.button-undo {
    cursor: pointer;
    float: right;
    font-size: 14px;
    font-weight: bold;
    margin-left: 20px;
    padding: 10px 10px 10px 10px;
    text-decoration: underline;
}
</style>

<script>
export const undo = {
    data: function() {
        return {
            allowUndo: false
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
        }
    }
};
export default undo;
</script>
