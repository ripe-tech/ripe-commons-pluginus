import { logError, logInfo, logDebug } from "../../js";

const loggingMixin = {
    methods: {
        logError(...args) {
            logError(...args);
        },
        logInfo(...args) {
            logInfo(...args);
        },
        logDebug(...args) {
            logDebug(...args);
        }
    }
};

export { loggingMixin };
