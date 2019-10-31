<template>
    <div class="info">
        <span class="info-button" v-on:click="showModal()" />
        <modal ref="modal" v-bind:visible="true">
                    <h3 class="title">{{ "ripe_commons.details.title" | locale }}</h3>
                    <h4 class="subtitle">{{ "ripe_commons.details.subtitle" | locale }}</h4>
                    <div class="paragraph-container">
                        <p v-for="(paragraph, index) in detailsText" v-bind:key="`p-${index}`">
                            {{ paragraph }}
                        </p>
                    </div>
                <div class="button-cancel" v-on:click="hideModal()">
                    {{ "ripe_commons.modal.got_it" | locale }}
                </div>
        </modal>
    </div>
</template>

<style scoped>
.info-button {
    background: url("~./assets/info.svg") center no-repeat;
    float: right;
    height: 70px;
    vertical-align: middle;
    width: 24px;
    cursor: pointer;
}

.paragraph-container {
    font-size: 14px;
    font-stretch: normal;
    font-style: normal;
    font-weight: normal;
    letter-spacing: 1.17px;
    line-height: normal;
    margin-bottom: 60px;
    text-align: center;
}

.button-cancel {
    background-color: #151515;
    display: inline;
    color: #ffffff;
    cursor: pointer;
    font-size: 14px;
    line-height: 40px;
    padding: 13px 101.6px 13px 101.6px;
}

.button-cancel:hover{
    opacity: .8;
    transition: opacity .125s ease-in-out;
    -moz-transition: opacity .125s ease-in-out;
    -webkit-transition: opacity .125s ease-in-out;
}

.button-cancel:active{
    opacity: .6;
    transition: opacity .125s ease-in-out;
    -moz-transition: opacity .125s ease-in-out;
    -webkit-transition: opacity .125s ease-in-out;
}

.button-cancel:disabled{
    opacity: .2;
}

</style>

<script>
import { modalMixin } from "../mixins";

export const info = {
    mixins: [modalMixin],
    data: function() {
        return {
            buttonText: "",
            paragraph: "",
            detailsParamText: null
        };
    },
    computed: {
        detailsText() {
            return (this.detailsParamText || this.locale("ripe_commons.details.text")).split("|");
        }
    },
    created: function() {
        this.$bus.bind("enable_info", this.enableSize);
        this.$bus.bind("disable_info", this.disableSize);
        this.$bus.bind("open_info", callback => {
            this.closeCallback = callback;
            this.showModal();
        });
        this.$bus.bind("close_info", () => {
            this.hideModal();
        });
    },
    mounted: function() {
        this.updateButtonText();
        this.$bus.bind("refresh", () => {
            this.updateButtonText();
        });
    },
    methods: {
        updateButtonText() {
            this.buttonText = this.infoText
                ? this.locale("ripe_commons.info.info") + " - " + this.infoText
                : this.locale("ripe_commons.info.select_info");
        }
    }
};

export default info;
</script>