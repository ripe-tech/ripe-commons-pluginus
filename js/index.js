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

function registerPlugins(manager) {
    DomLocaleLoaderPlugin.register(manager);
    FileLocaleLoaderPlugin.register(manager);
    LocalePlugin.register(manager);
    ModelLocaleLoaderPlugin.register(manager);
    ModelLocaleResolverPlugin.register(manager);
    BaseSizePlugin.register(manager);
    DevicePlugin.register(manager);
    UrlChangerPlugin.register(manager);
}

export { registerPlugins };
