<template>
    <div class="info">
        <span class="info-button" v-on:click="showModal()" />
        <modal v-bind:visible="true" ref="modal">
            <h3 class="title">{{ title }}</h3>
            <h4 class="subtitle">{{ subtitle }}</h4>
            <div class="paragraph-container">
                <p v-for="(paragraph, index) in paragraphs" v-bind:key="index">
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
    cursor: pointer;
    float: right;
    height: 70px;
    vertical-align: middle;
    width: 24px;
}

.paragraph-container {
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    margin-bottom: 60px;
    text-align: center;
}

.button-cancel {
    background-color: #151515;
    color: #ffffff;
    cursor: pointer;
    display: inline;
    font-size: 14px;
    line-height: 40px;
    padding: 13px 101.6px 13px 101.6px;
}

.button-cancel:hover {
    opacity: 0.8;
    -moz-transition: opacity 0.125s ease-in-out;
    -webkit-transition: opacity 0.125s ease-in-out;
    transition: opacity 0.125s ease-in-out;
}

.button-cancel:active {
    opacity: 0.6;
    -moz-transition: opacity 0.125s ease-in-out;
    -webkit-transition: opacity 0.125s ease-in-out;
    transition: opacity 0.125s ease-in-out;
}

.button-cancel:disabled {
    opacity: 0.2;
}
</style>

<script>
import { modalMixin } from "../mixins";

export const info = {
    mixins: [modalMixin],
    props: {
        content: {
            type: String,
            mandatory: true
        },
        title: {
            type: String,
            mandatory: true
        },
        subtitle: {
            type: String,
            mandatory: true
        }
    },
    computed: {
        paragraphs() {
            return this.content.split("\n");
        }
    }
};

export default info;
</script>
