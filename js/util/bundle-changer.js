// import { Ripe } from "ripe-sdk";
import { RipeCommonsPlugin, RipeCommonsCapability } from "../abstract";

export class BundleChangerPlugin extends RipeCommonsPlugin {
    async load() {
        await super.load();
        this.ripeProvider = await this.owner.getPluginByCapability("ripe-provider");

        this.onLocaleChangedWatch = this.owner.bind("locale_changed", locale =>
            this.onLocaleChanged(locale)
        );
    }

    async unload() {
        this.owner.unbind("locale_changed", this.onLocaleChangedWatch);
        await super.unload();
    }

    onLocaleChanged(locale = this.locale, defaultLocale = "en_us") {
        // ripeProvider isn't ready at plugin load time, using setInterval
        const ripeReadyInterval = setInterval(async () => {
            if (this.ripeProvider.ripe) clearInterval(ripeReadyInterval);

            const ripe = this.ripeProvider.ripe;
            const locales = [defaultLocale, locale];

            // build tuples of locales and respective bundle promises
            const localeBundleTuples = [];
            for (const locale of locales) {
                localeBundleTuples.push(
                    ripe.localeBundleP(locale, "scales"),
                    ripe.localeBundleP(locale, "sizes")
                );
            }

            const bundles = await Promise.all(localeBundleTuples);
            // add the fetched bundles
            bundles.forEach((bundle, index) => {
                const locale = locales[index];
                ripe.addBundle(bundle, locale);
            });
            this.owner.trigger("bundles");
        }, 250);
    }

    getCapabilities() {
        return [RipeCommonsCapability.new("helper")];
    }
}

BundleChangerPlugin.register();
