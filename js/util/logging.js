export const SHOW_LEVEL = false;

export const logError = (value, label = null) => {
    console.error(_format(value, label, "ERROR"));
};

export const logInfo = (value, label = null) => {
    console.info(_format(value, label, "INFO"));
};

export const logDebug = (value, label = null) => {
    console.debug(_format(value, label, "DEBUG"));
};

const _format = (value, label = null, level = null) => {
    if (typeof value === "function") value = value();
    label = label || "RIPE";
    return `${SHOW_LEVEL && level ? "[" + level + "] " : ""}[${label}] ${value}`;
};
