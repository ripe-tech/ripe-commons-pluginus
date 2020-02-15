import * as personalizationForm from "./personalization-form";
import * as sizeForm from "./size-form";

import { Keyboard } from "./keyboard";
import { Loader } from "./loader";
import { Modal } from "./modal";
import { InitialsImages, InitialsInputs } from "./personalization-form";

export { pickers } from "./pickers";
export { referenceMulti, reference } from "./size-form";
export { tab, tabs } from "./tabs";
export { componentPlugin } from "./component-plugin.vue";
export { configurator } from "./configurator.vue";
export { personalization } from "./personalization.vue";
export { restrictionsAlert } from "./restrictions-alert";
export { size } from "./size.vue";
export { thumbnail } from "./thumbnail.vue";
export { thumbnails } from "./thumbnails.vue";

const install = Vue => {
    Vue.component("keyboard", Keyboard);
    Vue.component("loader", Loader);
    Vue.component("modal", Modal);
    Vue.component("initials-images", InitialsImages);
    Vue.component("initials-inputs", InitialsInputs);
};

export {
    Keyboard,
    Loader,
    Modal,
    InitialsImages,
    InitialsInputs
};

export { install, personalizationForm, sizeForm };

export default install;
