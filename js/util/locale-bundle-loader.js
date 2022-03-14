import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class LocaleBundleLoaderPlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.ripeProvider = await this.owner.getPluginByCapability("ripe-provider");
        this.loadedBundles = [];

        this.onLocaleChangedWatch = this.owner.bind(
            "locale_changed",
            async locale => await this.onLocaleChanged(locale)
        );
    }

    async unload() {
        this.owner.unbind("locale_changed", this.onLocaleChangedWatch);
        this.ripeProvider = null;
        await super.unload();
    }

    async onLocaleChanged(locale = this.locale) {
        this._tryLoadLocaleBundle(locale);
    }

    async _tryLoadLocaleBundle(locale) {
        // if ripeProvider isn't ready, try again later
        if (!this.ripeProvider.ripe) {
            const ripeReadyInterval = setInterval(async () => {
                if (!this.ripeProvider.ripe) return;

                clearInterval(ripeReadyInterval);
                await this.loadLocaleBundle(locale);
            }, 250);
            return;
        }

        await this.loadLocaleBundle(locale);
    }

    async loadLocaleBundle(locale) {
        // skip if bundle is already loaded
        if (this.loadedBundles.includes(locale)) return;

        const ripe = this.ripeProvider.ripe;

        ripe._initBundles(locale, null);

        this.loadedBundles.push(locale);
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }
}

LocaleBundleLoaderPlugin.register();
