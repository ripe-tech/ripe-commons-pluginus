import { DevicePlugin, UrlChangerPlugin, BundleChangerPlugin } from "./util";

import {
    DomLocaleLoaderPlugin,
    FileLocaleLoaderPlugin,
    LocalePlugin,
    ModelLocaleLoaderPlugin,
    ModelLocaleResolverPlugin
} from "./locale";

import { BasePersonalizationPlugin, BaseSizePlugin } from "./ui";

export * from "./abstract";
export * from "./base";
export * from "./locale";
export * from "./ui";
export * from "./util";

export const registerPlugins = owner => {
    DomLocaleLoaderPlugin.register(owner);
    FileLocaleLoaderPlugin.register(owner);
    LocalePlugin.register(owner);
    ModelLocaleLoaderPlugin.register(owner);
    ModelLocaleResolverPlugin.register(owner);
    BasePersonalizationPlugin.register(owner);
    BaseSizePlugin.register(owner);
    DevicePlugin.register(owner);
    UrlChangerPlugin.register(owner);
    BundleChangerPlugin.register(owner);
};
