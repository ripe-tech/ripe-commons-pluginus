import * as personalizationForm from "./personalization-form";
import * as sizeForm from "./size-form";

import { ComponentPlugin } from "./component-plugin";
import { Configurator } from "./configurator";
import { Keyboard } from "./keyboard";
import { Loader } from "./loader";
import { Modal } from "./modal";
import { Personalization } from "./personalization";
import { InitialsImages, initialsInputs } from "./personalization-form";
import { Pickers } from "./pickers";
import { RestrictionsAlert } from "./restrictions-alert";
import { Size } from "./size";
import { Tab, Tabs } from "./tabs";
import { Thumbnail } from "./thumbnail";
import { Thumbnails } from "./thumbnails";

const install = Vue => {
    Vue.component("component-plugin", ComponentPlugin);
    Vue.component("configurator", Configurator);
    Vue.component("keyboard", Keyboard);
    Vue.component("loader", Loader);
    Vue.component("modal", Modal);
    Vue.component("personalization", Personalization);
    Vue.component("pickers", Pickers);
    Vue.component("restrictions-alert", RestrictionsAlert);
    Vue.component("size", Size);
    Vue.component("tab", Tab);
    Vue.component("tabs", Tabs);
    Vue.component("thumbnail", Thumbnail);
    Vue.component("thumbnails", Thumbnails);

    Vue.component("initials-images", InitialsImages);
    Vue.component("initials-inputs", initialsInputs);
};

export {
    install,
    ComponentPlugin,
    Configurator,
    Keyboard,
    Loader,
    Modal,
    Personalization,
    Pickers,
    RestrictionsAlert,
    Size,
    Tab,
    Tabs,
    Thumbnail,
    Thumbnails,

    InitialsImages,
    initialsInputs
};

export { personalizationForm, sizeForm };

export default install;
