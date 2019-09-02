import { Observable } from "pluginus";

const busPlugin = {
    install(Vue) {
        const bus = new Observable();
        Object.defineProperty(Vue.prototype, "$bus", {
            value: bus
        });
    }
};

export { busPlugin };
