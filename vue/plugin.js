const plugins = [];

const Plugin = function(name, version, options) {
    this.name = name;
    this.version = version;
    this.options = options;
};

const registerPlugin = function(plugin) {
    plugins.push(plugin);
};

const unregisterPlugin = function(plugin) {
    const index = plugins.indexOf(plugin);
    if (index === -1) {
        return;
    }
    plugins.splice(index, 1);
};

const getPlugin = function(name, options) {
    return plugins.find(plugin => plugin.name === name);
};

const hasPlugin = function(name) {
    return typeof plugins.find(plugin => plugin.name === name) !== "undefined";
};

export { Plugin, registerPlugin, unregisterPlugin, getPlugin, hasPlugin };
export default {
    Plugin,
    registerPlugin,
    unregisterPlugin,
    getPlugin,
    hasPlugin
};
