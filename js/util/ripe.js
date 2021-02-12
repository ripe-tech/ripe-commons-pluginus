/**
 * Resolves both the main initials and engraving taking into consideration
 * the provided initials extra as a fallback process.
 *
 * @param {Object} initialsExtra The dictionary structure associating
 * the multiple initials groups with their initials engraving values.
 * @param {String} initials The initials to be used as override if any.
 * @param {String} engraving The engraving to be used as override if any.
 * @returns {Object} The normalized initials and engraving values withing
 * an object resolved according to the provided initials extra (main group)
 * or the initials and engraving parameters.
 */
export const initialsFromExtra = function(
    initialsExtra,
    initials = undefined,
    engraving = undefined
) {
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
