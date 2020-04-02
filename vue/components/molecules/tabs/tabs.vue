<template>
    <div class="tabs">
        <div class="background" />
        <div class="tabs-container">
            <tab
                v-bind:tab="tab"
                v-bind:active="tab.id === activeTab"
                v-for="tab in tabs"
                v-bind:key="tab.id"
                v-bind:ref="tab.id"
                v-on:selected="() => selectTab(tab.id)"
            >
                <slot v-bind:tab="tab" />
            </tab>
        </div>
    </div>
</template>

<style scoped>
.tabs {
    border-radius: 20px 20px 20px 20px;
    height: 100px;
    position: relative;
}

.background {
    background-color: #f5f5f5;
    border-bottom: 1px solid #e9eaee;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    height: 92%;
    left: 0px;
    position: absolute;
    right: 0px;
    top: 5px;
}

.tabs-container {
    font-size: 0px;
    margin: 0px 0px 0px 0px;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    white-space: nowrap;
}

.tabs-container::-webkit-scrollbar {
    background: transparent;
    height: 0px;
}
</style>

<script>
export const Tabs = {
    name: "tabs",
    props: {
        tabs: {
            type: Array,
            default: () => []
        },
        initialTab: {
            type: String,
            default: null
        }
    },
    data: function() {
        return {
            activeTab: this.initialTab
        };
    },
    watch: {
        activeTab(tabId) {
            const tab = this.getTab(tabId);
            this.$emit("tab-selected", tab);
        }
    },
    methods: {
        getTab(tabId) {
            return this.tabs.find(tab => tab.id === tabId);
        },
        selectTab(tabId) {
            this.activeTab = tabId;
        }
    }
};

export default Tabs;
</script>
