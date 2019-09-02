<template>
    <div class="header" v-bind:class="{ hasPrevious: showPrevious }">
        <div class="previous" v-if="showPrevious">
            <a v-bind:href="hrefPrevious">
                <span class="label-previous">{{ labelPrevious }}</span>
            </a>
        </div>
        <div class="title">
            <span>{{ title }}</span>
        </div>
        <a
            class="next"
            v-bind:href="hrefNext"
            v-bind:class="{ clickable: clickableNext }"
            v-on:click="onNextClick($event)"
        >
            <span class="label-next-strong" v-if="labelNextStrong">{{ labelNextStrong }}</span>
            <span class="label-next" v-if="labelNext">{{ labelNext }}</span>
        </a>
    </div>
</template>

<style scoped>
.header {
    background-color: #ffffff;
    border-bottom: 1px solid #eeeeee;
    height: 70px;
    text-align: center;
    user-select: none;
    width: 100%;
}

body.tablet .title,
body.mobile .title {
    float: left;
    height: 70px;
    white-space: nowrap;
    width: calc(100% - 150px);
}

body.tablet .header.hasPrevious .title,
body.mobile .header.hasPrevious .title {
    width: calc(100% - 185px);
}

body.tablet .title > span,
body.mobile .title > span {
    display: inline-block;
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
}

.previous {
    float: left;
    font-size: 12px;
    line-height: 70px;
}

.previous > a {
    background: url("~./assets/back-arrow.svg") center left no-repeat;
    color: #999999;
    padding-left: 20px;
}

body.desktop .previous > a {
    margin-left: 30px;
}

body.tablet .previous > a {
    margin-left: 30px;
}

body.tablet .previous > a,
body.mobile .previous > a {
    margin-left: 15px;
}

.previous a:hover {
    color: #6b6969;
    -webkit-transition: color 0.4s;
    -o-transition: color 0.4s;
    -ms-transition: color 0.4s;
    -moz-transition: color 0.4s;
    -khtml-transition: color 0.4s;
    transition: color 0.4s;
}

.label-previous {
    font-weight: 600;
    height: 40px;
    padding-right: 5px;
    text-transform: uppercase;
    width: 120px;
}

body.tablet .next,
body.mobile .next {
    width: 150px;
}

body.tablet .label-previous,
body.mobile .label-previous {
    display: none;
}

.title {
    color: #333333;
    display: inline-block;
    font-size: 17px;
    font-weight: 600;
    line-height: 70px;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    width: calc(100vw - 470px);
}

.next {
    background-color: #333333;
    color: #ffffff;
    cursor: default;
    float: right;
    height: 70px;
    line-height: 70px;
    text-align: center;
    width: 250px;
}

.next.clickable {
    cursor: pointer;
}

.next.clickable:hover {
    background-color: #3f3e3e;
    -webkit-transition: background-color 0.4s;
    transition: background-color 0.4s;
}

.label-next-strong {
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    text-transform: uppercase;
}

.label-next {
    font-size: 16px;
    margin-left: 8px;
}
</style>

<script>
export const header = {
    props: {
        title: {
            type: String,
            default: ""
        },
        hrefPrevious: {
            type: String,
            default: null
        },
        labelPrevious: {
            type: String,
            default: ""
        },
        labelNextStrong: {
            type: String,
            default: ""
        },
        hrefNext: {
            type: String,
            default: null
        },
        labelNext: {
            type: String,
            default: ""
        }
    },
    computed: {
        showPrevious() {
            return this.labelPrevious;
        },
        clickableNext() {
            return this.labelNext;
        }
    },
    methods: {
        onNextClick(event) {
            event.stopImmediatePropagation();
            event.preventDefault();

            if (!this.clickableNext) {
                return;
            }

            this.$emit("next", this.hrefNext);
        }
    }
};

export default header;
</script>
