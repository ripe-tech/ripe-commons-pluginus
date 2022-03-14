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
        if (!this.ripeProvider.ripe) {
            // promise to await ripe provider loaded and ready event
            return new Promise(resolve => {
                const ripeProviderReadyBind = this.owner.bind("ripe_provider", () => {
                    this.owner.unbind("locale_changed", ripeProviderReadyBind);
                    this.loadLocaleBundle(locale);
                });
            });
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
