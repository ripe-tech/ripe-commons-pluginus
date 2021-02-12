export const initialsFromExtra = function(initialsExtra, initials, engraving) {
    initialsExtra = initialsExtra || {};
    const groups = Object.keys(initialsExtra);
    const mainGroup = groups.includes("main") || groups.length === 0 ? "main" : groups[0];
    const mainInitials = initialsExtra[mainGroup] || {};

    initials = initials === undefined ? mainInitials.initials : initials;
    engraving = engraving === undefined ? mainInitials.engraving : engraving;

    return {
        initials: initials || "",
        engraving: engraving || null
    };
};
