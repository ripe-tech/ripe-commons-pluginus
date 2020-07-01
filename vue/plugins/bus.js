import { Observable } from "pluginus";

export const busPlugin = {
    install(Vue) {
        const bus = new Observable();
        Object.defineProperty(Vue.prototype, "$bus", {
            value: bus
        });
    }
};
