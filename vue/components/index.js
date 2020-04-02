import * as personalizationForm from "./personalization-form";
import * as sizeForm from "./size-form";

import Atoms from "./atoms";
import Molecules from "./molecules";
import Logic from "./logic";

import { ComponentPlugin } from "./component-plugin";
import { Configurator } from "./configurator";
import { Modal } from "./modal";
import { Personalization } from "./personalization";
import { Pickers } from "./pickers";
import { RestrictionsAlert } from "./restrictions-alert";
import { Size } from "./size";
import { Tab, Tabs } from "./tabs";
import { Thumbnail } from "./thumbnail";
import { Thumbnails } from "./thumbnails";

const install = Vue => {
    Vue.component("component-plugin", ComponentPlugin);
    Vue.component("configurator", Configurator);
    Vue.component("modal", Modal);
    Vue.component("personalization", Personalization);
    Vue.component("pickers", Pickers);
    Vue.component("restrictions-alert", RestrictionsAlert);
    Vue.component("size", Size);
    Vue.component("tab", Tab);
    Vue.component("tabs", Tabs);
    Vue.component("thumbnail", Thumbnail);
    Vue.component("thumbnails", Thumbnails);

    Vue.component("initials-images", personalizationForm.InitialsImages);
    Vue.component("initials-inputs", personalizationForm.InitialsInputs);

    Vue.use(Atoms);
    Vue.use(Molecules);
    Vue.use(Logic);
};

export * from "./atoms";
export * from "./molecules";
export * from "./logic";

export {
    install,
    ComponentPlugin,
    Configurator,
    Modal,
    Personalization,
    Pickers,
    RestrictionsAlert,
    Size,
    Tab,
    Tabs,
    Thumbnail,
    Thumbnails
};

export const InitialsImages = personalizationForm.InitialsImages;
export const InitialsInputs = personalizationForm.InitialsInputs;

export { personalizationForm, sizeForm };

export default install;
