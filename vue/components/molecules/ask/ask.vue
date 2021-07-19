<template>
    <div class="ask">
        <modal class="modal" v-bind:visible="true" ref="modal">
            <h3 class="title">{{ titleData }}</h3>
            <div class="message" v-html="messageHtml" />
            <div class="buttons-container">
                <div class="buttons">
                    <button-ripe
                        class="button button-color button-ask-cancel"
                        v-bind:disabled="loading"
                        v-if="buttonCancelData"
                        v-on:click="onCancelClick"
                    >
                        {{ buttonCancelData }}
                    </button-ripe>
                    <button-ripe
                        class="button button-color button-color-secondary button-ask-confirm"
                        v-bind:loading="loading"
                        v-if="buttonConfirmData"
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
    z-index: 11;
}

.ask .message {
    color: #0d0d0d;
    font-size: 15px;
    line-height: 22px;
    margin: 28px 0px 28px 0px;
    word-break: break-all;
}

.ask .modal ::v-deep .modal-container {
    max-width: 100%;
    min-width: 520px;
}

.ask .buttons-container {
    font-size: 0px;
    margin-top: 15px;
}

.ask .buttons-container > .buttons > .button {
    margin: 0px 12px 0px 12px;
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
            default: "Cancel"
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
    computed: {
        messageHtml() {
            if (!this.messageData) return this.messageData;
            return this.messageData.replace(/\n/g, "<br/>");
        }
    },
    mounted: function() {
        if (this.global) {
            this.$bus.bind("ask", options => {
                this.callbackData = options.callback || null;
                this.operationData = options.operation || null;
                this.titleData = options.title || "Title";
                this.messageData = options.message || "Message";
                this.buttonConfirmData =
                    options.buttonConfirm === undefined ? "Confirm" : options.buttonConfirm;
                this.buttonCancelData =
                    options.buttonCancel === undefined ? "Cancel" : options.buttonCancel;
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
                this.callbackData({ result: true });
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
