import * as personalizationForm from "./personalization-form";
import * as sizeForm from "./size-form";

import { ComponentPlugin } from "./component-plugin";
import { Configurator } from "./configurator";
import { Keyboard } from "./keyboard";
import { Loader } from "./loader";
import { Modal } from "./modal";
import { Personalization } from "./personalization";
import { InitialsImages, InitialsInputs } from "./personalization-form";
import { Pickers } from "./pickers";
import { RestrictionsAlert } from "./restrictions-alert";

export { referenceMulti, reference } from "./size-form";
export { tab, tabs } from "./tabs";

export { size } from "./size.vue";
export { thumbnail } from "./thumbnail.vue";
export { thumbnails } from "./thumbnails.vue";

const install = Vue => {
    Vue.component("component-plugin", ComponentPlugin);
    Vue.component("configurator", Configurator);
    Vue.component("keyboard", Keyboard);
    Vue.component("loader", Loader);
    Vue.component("modal", Modal);
    Vue.component("personalization", Personalization);
    Vue.component("initials-images", InitialsImages);
    Vue.component("initials-inputs", InitialsInputs);
    Vue.component("pickers", Pickers);
    Vue.component("restrictions-alert", RestrictionsAlert);
};

export {
    ComponentPlugin,
    Configurator,
    Keyboard,
    Loader,
    Modal,
    Personalization,
    InitialsImages,
    InitialsInputs,
    Pickers,
    RestrictionsAlert
};

export { install, personalizationForm, sizeForm };

export default install;
