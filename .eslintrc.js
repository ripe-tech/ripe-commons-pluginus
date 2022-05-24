module.exports = {
    extends: ["hive/vue", "hive/prettier"],
    rules: {
        "vue/no-v-html": ["off"],
        "vue/no-child-content": ["off"]
    },
    env: {
        mocha: true
    }
};
