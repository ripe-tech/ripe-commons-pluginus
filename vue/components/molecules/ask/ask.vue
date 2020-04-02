<template>
    <div class="ask">
        <modal class="modal" v-bind:visible="true" ref="modal">
            <h3 class="title">{{ titleData }}</h3>
            <div class="message">
                {{ messageData }}
            </div>
            <div class="buttons-container">
                <div class="buttons">
                    <button-ripe
                        class="button button-color button-cancel"
                        v-bind:disabled="loading"
                        v-on:click="onCancelClick"
                    >
                        {{ buttonCancelData }}
                    </button-ripe>
                    <button-ripe
                        class="button button-color button-color-secondary button-confirm"
                        v-bind:loading="loading"
                        v-on:click="onConfirmClick"
                    >
                        {{ buttonConfirmData }}
                    </button-ripe>
                </div>
            </div>
        </modal>
    </div>
</template>

<style scoped>
.ask {
    position: absolute;
    z-index: 13;
}

.ask .modal ::v-deep .modal-container {
    max-width: 100%;
    min-width: 600px;
}

.ask .buttons-container {
    margin-top: 15px;
}

.ask .buttons-container > .button {
    height: 48px;
    line-height: 48px;
}
</style>

<script>
import { modalMixin } from "../../../mixins";

export const Ask = {
    name: "ask",
    mixins: [modalMixin],
    props: {
        callback: {
            type: Function,
            default: null
        },
        operation: {
            type: Function,
            default: null
        },
        title: {
            type: String,
            default: "Title"
        },
        message: {
            type: String,
            default: "Message"
        },
        buttonConfirm: {
            type: String,
            default: "Confirm"
        },
        buttonCancel: {
            type: String,
            default: "Confirm"
        },
        global: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return {
            callbackData: this.callback,
            operationData: this.operation,
            titleData: this.title,
            messageData: this.message,
            buttonConfirmData: this.buttonConfirm,
            buttonCancelData: this.buttonCancel,
            loading: false
        };
    },
    mounted: function() {
        if (this.global) {
            this.$bus.bind("ask", options => {
                this.callbackData = options.callback || null;
                this.operationData = options.operation || null;
                this.titleData = options.title || "Title";
                this.messageData = options.message || "Message";
                this.buttonConfirmData = options.buttonConfirm || "Confirm";
                this.buttonConfirmData = options.buttonCancel || "Cancel";
                this.showModal();
            });
        }
    },
    methods: {
        async onCancelClick() {
            this.hideModal(false);
        },
        async onConfirmClick() {
            this.loading = true;
            try {
                if (this.operationData) {
                    await this.operationData({ result: true });
                }
            } finally {
                this.loading = false;
                this.hideModal(true);
            }
            if (this.callbackData) {
                this.callbackData({
                    result: true
                });
            }
        },
        async willHideModal(result) {
            if (result) return;
            if (this.callbackData) {
                this.callbackData({ result: false });
            }
        }
    }
};

export default Ask;
</script>
