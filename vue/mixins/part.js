export const partMixin = {
    methods: {
        isMobile() {
            return this.$root.$device && this.$root.$device.isMobile;
        },
        isTablet() {
            return this.$root.$device && this.$root.$device.isTablet;
        },
        isDevice() {
            return this.$root.$device && this.$root.$device.isDevice;
        },
        isDesktop() {
            return this.$root.$device && this.$root.$device.isDesktop;
        },
        isTouch() {
            return this.$root.$device && this.$root.$device.isTouch;
        },
        isMouse() {
            return this.$root.$device && this.$root.$device.isMouse;
        },
        isDesktopWidth() {
            return this.$root.$device && this.$root.$device.isDesktopWidth;
        },
        isTabletWidth() {
            return this.$root.$device && this.$root.$device.isTabletWidth;
        },
        isMobileWidth() {
            return this.$root.$device && this.$root.$device.isMobileWidth;
        }
    }
};
