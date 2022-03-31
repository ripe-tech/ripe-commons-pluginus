const FRAME_REGEX = /(?<=personalization-\[\w*\]-).*/;
const GROUP_REGEX = /(?<=personalization-\[)\w*(?=\])/;

export const frameMixin = {
    methods: {
        isPersonalizationFrame(value) {
            return value.startsWith("personalization-");
        },
        isVideoFrame(value) {
            return value.startsWith("video-");
        },
        getOnlyFrame(value) {
            if (this.isVideoFrame(value)) return this.getVideoFrame(value);
            if (this.isPersonalizationFrame(value)) return this.getFramePersonalization(value);
            return value;
        },
        getVideoFrame(value) {
            return value.split("video-")[1];
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
