<template>
    <div class="info">
        <span class="info-button" v-on:click="showModal()" />
        <modal ref="modal" v-bind:visible="true">
            <h3 class="title"> {{title}} </h3>
            <h4 class="subtitle"> {{subtitle}} </h4>
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
    float: right;
    height: 70px;
    vertical-align: middle;
    width: 24px;
    cursor: pointer;
}

.paragraph-container {
    font-size: 14px;
    margin-bottom: 60px;
    text-align: center;
    line-height: normal;
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