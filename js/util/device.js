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

    listen() {
        window.addEventListener("resize", () => this.updateClass());
    }

    updateClass() {
        const width = window.innerWidth;

        this.body.classList.remove(this.desktopClass);
        this.body.classList.remove(this.tabletClass);
        this.body.classList.remove(this.mobileClass);

        if (width > this.TABLET_WIDTH) {
            this.body.classList.add(this.desktopClass);
        } else if (width > this.MOBILE_WIDTH) {
            this.body.classList.add(this.tabletClass);
        } else {
            this.body.classList.add(this.mobileClass);
        }
    }
}

DevicePlugin.register();

export { DevicePlugin };
