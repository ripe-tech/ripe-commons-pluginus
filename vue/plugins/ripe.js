export const ripePlugin = {
    install(Vue, ripe) {
        Object.defineProperty(Vue.prototype, "$ripe", {
            value: ripe
        });
    }
};
