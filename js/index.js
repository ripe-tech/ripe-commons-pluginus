import { DevicePlugin, UrlChangerPlugin } from "./util";

import {
    DomLocaleLoaderPlugin,
    FileLocaleLoaderPlugin,
    LocalePlugin,
    ModelLocaleLoaderPlugin,
    ModelLocaleResolverPlugin
} from "./locale";

import { BaseSizePlugin } from "./ui";

export * from "./abstract";
export * from "./base";
export * from "./locale";
export * from "./ui";
export * from "./util";

function registerPlugins(owner) {
    FileLocaleLoaderPlugin.register(owner);
    DomLocaleLoaderPlugin.register(owner);
    LocalePlugin.register(owner);
    ModelLocaleLoaderPlugin.register(owner);
    ModelLocaleResolverPlugin.register(owner);
    BaseSizePlugin.register(owner);
    DevicePlugin.register(owner);
    UrlChangerPlugin.register(owner);
}

export { registerPlugins };
