<template>
    <div id="undo">
        <div class="message-undo-container">
            <div class="message-undo" v-bind:class="{ visible: allowUndo }">
                <a class="button button-undo" v-on:click="undo()">
                    {{ "ripe_commons.pickers.undo" | locale }}
                </a>
                <span>
                    {{ "ripe_commons.pickers.limited" | locale }}
                    {{ "ripe_commons.pickers.back" | locale }}
                </span>
            </div>
        </div>
    </div>
</template>
<style scoped>

.pickers .message-undo-container {
    overflow: hidden;
}

.pickers .message-undo {
    background-color: #ececec;
    border-radius: 5px;
    display: block;
    font-size: 11px;
    line-height: 14px;
    margin: 0px auto 0px auto;
    max-width: 580px;
    padding: 10px 20px 10px 30px;
    text-align: left;
    transform: translateY(-100%);
    transition: transform 0.5s ease-in-out;
}

.pickers .message-undo.visible {
    transform: translateY(0px);
}

.pickers .message-undo .button.button-undo {
    cursor: pointer;
    float: right;
    font-size: 12px;
    font-weight: bold;
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
            allowUndo: false
        }
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




