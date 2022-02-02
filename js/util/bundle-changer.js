import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class BundleChangerPlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.ripeProvider = await this.owner.getPluginByCapability("ripe-provider");

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

    async loadLocaleBundle(locale, defaultLocale = "en_us") {
        const ripe = this.ripeProvider.ripe;
        const locales = [defaultLocale, locale];

        // build tuples of locales and respective bundle promises
        const localeBundleTuples = [];
        for (const locale of new Set(locales)) {
            localeBundleTuples.push(
                [locale, ripe.localeBundleP(locale, "scales")],
                [locale, ripe.localeBundleP(locale, "sizes")]
            );
        }
        // deconstruct the tuple to respective locales and bundle promises
        // then fetch all bundles in parallel
        const [bundlesLocales, bundlesPromises] = localeBundleTuples.reduce(
            (array, [locale, bundlePromise]) => [
                [...array[0], locale],
                [...array[1], bundlePromise]
            ],
            [[], []]
        );
        const bundles = await Promise.all(bundlesPromises);
        // add the fetched bundles
        bundles.forEach((bundle, index) => {
            const locale = bundlesLocales[index];
            ripe.addBundle(bundle, locale);
        });
        this.owner.trigger("bundles");
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }
}

BundleChangerPlugin.register();
