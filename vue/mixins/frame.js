export const frameMixin = {
    methods: {
        isPersonalizationFrame(value) {
            return value.startsWith("personalization-");
        },
        isVideoFrame(value) {
            return value.startsWith("video-");
        },
        getFrame(value) {
            if (this.isVideoFrame(value)) return this.getVideoFrame(value);
            if (this.isPersonalizationFrame(value)) return this.getFramePersonalization(value);
            return value;
        },
        getVideoFrame(value) {
            return value.split(/^video-/)[1];
        },
        getFramePersonalization(value) {
            const name = value.split(/^personalization-/)[1];
            const thumbnail = this.$store.state.config.thumbnails.find(
                thumbnail => thumbnail.name === name && thumbnail.type === "personalization"
            );
            if (!thumbnail) return;
            return thumbnail.face && thumbnail.frame
                ? `${thumbnail.face}-${thumbnail.frame}`
                : null;
        },
        getGroupPersonalization(value) {
            const name = value.split(/^personalization-/)[1];
            const thumbnail = this.$store.state.config.thumbnails.find(
                thumbnail => thumbnail.name === name && thumbnail.type === "personalization"
            );
            if (!thumbnail) return;
            return thumbnail.group || "main";
        },
        getProfilesPersonalization(value) {
            const name = value.split(/^personalization-/)[1];
            const thumbnail = this.$store.state.config.thumbnails.find(
                thumbnail => thumbnail.name === name && thumbnail.type === "personalization"
            );
            if (!thumbnail) return;
            return thumbnail.profiles || null;
        }
    }
};
