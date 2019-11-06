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
