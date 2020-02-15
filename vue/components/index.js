import * as personalizationForm from "./personalization-form";
import * as sizeForm from "./size-form";

import { loader } from "./loader.vue";
import { keyboard } from "./keyboard";
import { initialsImages, initialsInputs } from "./personalization-form";

export { pickers } from "./pickers";
export { referenceMulti, reference } from "./size-form";
export { tab, tabs } from "./tabs";
export { componentPlugin } from "./component-plugin.vue";
export { configurator } from "./configurator.vue";
export { modal } from "./modal.vue";
export { personalization } from "./personalization.vue";
export { restrictionsAlert } from "./restrictions-alert";
export { size } from "./size.vue";
export { thumbnail } from "./thumbnail.vue";
export { thumbnails } from "./thumbnails.vue";

const install = Vue => {
    Vue.component("loader", loader);
    Vue.component("keyboard", keyboard);
    Vue.component("initials-images", initialsImages);
    Vue.component("initials-inputs", initialsInputs);
};

export { loader, keyboard, initialsImages, initialsInputs };

export { install, personalizationForm, sizeForm };

export default install;
