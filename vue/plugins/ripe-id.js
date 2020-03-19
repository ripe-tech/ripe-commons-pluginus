const ripeIdPlugin = {
    install(Vue, ripeId) {
        Object.defineProperty(Vue.prototype, "$ripeId", {
            value: ripeId
        });
    }
};

export { ripeIdPlugin };
