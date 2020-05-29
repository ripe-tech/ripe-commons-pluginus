const plugins = [];

export const Plugin = function(name, version, options) {
    this.name = name;
    this.version = version;
    this.options = options;
};

export const registerPlugin = function(plugin) {
    plugins.push(plugin);
};

export const unregisterPlugin = function(plugin) {
    const index = plugins.indexOf(plugin);
    if (index === -1) {
        return;
    }
    plugins.splice(index, 1);
};

export const getPlugin = function(name, options) {
    return plugins.find(plugin => plugin.name === name);
};

export const hasPlugin = function(name) {
    return typeof plugins.find(plugin => plugin.name === name) !== "undefined";
};

export default {
    Plugin,
    registerPlugin,
    unregisterPlugin,
    getPlugin,
    hasPlugin
};
