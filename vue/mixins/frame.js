const FRAME_REGEX = /(?<=personalization-\[\w*\]-).*/;
const GROUP_REGEX = /(?<=personalization-\[)\w*(?=\])/;

export const frameMixin = {
    methods: {
        isPersonalizationFrame(value) {
            return value.startsWith("personalization-");
        },
        getFramePersonalization(value) {
            const result = value.match(FRAME_REGEX);
            return result && result.length > 0 ? result[0] : value;
        },
        getGroupPersonalization(value) {
            const result = value.match(GROUP_REGEX);
            return result && result.length > 0 ? result[0] : null;
        }
    }
};
