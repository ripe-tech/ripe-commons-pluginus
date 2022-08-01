import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class LocaleBundleLoaderPlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.ripeProvider = await this.owner.getPluginByCapability("ripe-provider");
        this.loadedBundles = [];

        // registers for the locale changed event so
        // that we can try to load the locale bundle in
        // case it's currently not registered
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
        if (this.ripeProvider.ripe) {
            await this.loadLocaleBundle(locale);
        } else {
            // in case ripe provider's ripe instance is not yet accessible
            // then waits for the loading of the plugin to make sure that
            // the store is available
            const postLoadBind = this.owner.bind("post_load", () => {
                this.owner.unbind("post_load", postLoadBind);
                this.loadLocaleBundle(locale);
            });
        }
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
