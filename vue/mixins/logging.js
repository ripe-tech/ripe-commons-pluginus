import { logError, logInfo } from "../../js";

const loggingMixin = {
    methods: {
        logError(...args) {
            logError(...args);
        },
        logInfo(...args) {
            logInfo(...args);
        }
    }
};

export { loggingMixin };
