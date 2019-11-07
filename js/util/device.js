import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

class DevicePlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.init();
    }

    async unload() {
        await super.unload();
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }

    init() {
        this.desktopClass = "desktop";
        this.tabletClass = "tablet";
        this.mobileClass = "mobile";
        this.TABLET_WIDTH = 768;
        this.MOBILE_WIDTH = 420;

        this.body = document.getElementsByTagName("body")[0];
        this.listen();
        this.updateClass();
    }

    setTabletWidth(width, update = false) {
        this.tabletWidth = width;
        if (update) this.updateClass();
    }

    setMobileWidth(width, update = false) {
        this.mobileWidth = width;
        if (update) this.updateClass();
    }

    listen() {
        window.addEventListener("resize", () => this.updateClass());
    }

    updateClass() {
        const width = window.innerWidth;

        this.body.classList.remove(this.desktopClass);
        this.body.classList.remove(this.tabletClass);
        this.body.classList.remove(this.mobileClass);

        const tabletWidth = this.tabletWidth || this.TABLET_WIDTH;
        const mobileWidth = this.mobileWidth || this.MOBILE_WIDTH;

        if (width > tabletWidth) {
            this.body.classList.add(this.desktopClass);
        } else if (width > mobileWidth) {
            this.body.classList.add(this.tabletClass);
        } else {
            this.body.classList.add(this.mobileClass);
        }
    }
}

DevicePlugin.register();

export { DevicePlugin };
