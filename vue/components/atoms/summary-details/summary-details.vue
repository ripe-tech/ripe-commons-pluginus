<template>
    <div class="summary-details">
        <h2 class="title">{{ title }}</h2>
        <a class="link" v-if="linkText !== ''" v-on:click="onLinkClick">{{ linkText }}</a>
        <div v-if="Object.keys(detailsInfo).length === 0">
            No {{ title }}
        </div>
        <div
            class="details"
            v-for="[key, value] in Object.entries(detailsInfo || {})"
            v-else
            v-bind:key="key"
        >
            <p class="key">
                {{ key }}:
            </p>
            <p class="value">
                {{ value }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.summary-details {
    max-width: 280px;
    text-align: left;
    width: 100%;
}

body.tablet .summary-details,
body.mobile .summary-details {
    max-width: 100%;
    width: 100%;
}

.summary-details > .title {
    color: #1d2631;
    display: inline-block;
    font-size: 16px;
    font-weight: 600;
    margin: 0px 0px 12px 0px;
    text-transform: capitalize;
}

.summary-details > .link {
    color: #1d2631;
    cursor: pointer;
    float: right;
    font-size: 14px;
    text-decoration: underline;
}

.summary-details > .details {
    margin-bottom: 12px;
}

.summary-details > .details > * {
    display: inline-block;
    line-height: 18px;
    margin: 0px 0px 0px 0px;
}

.summary-details > .details > .key {
    font-weight: 500;
    text-transform: capitalize;
}
</style>

<script>
export const SummaryDetails = {
    name: "summary-details",
    props: {
        title: {
            type: String,
            required: true
        },
        linkText: {
            type: String,
            required: true
        },
        detailsInfo: {
            type: Object,
            required: true
        }
    },
    methods: {
        onLinkClick() {
            this.$emit("click");
        }
    }
};

export default SummaryDetails;
</script>
