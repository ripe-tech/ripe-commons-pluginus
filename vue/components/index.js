import * as personalizationForm from "./personalization-form";
import * as sizeForm from "./size-form";

import Atoms from "./atoms";
import Molecules from "./molecules";
import Logic from "./logic";

import { ComponentPlugin } from "./component-plugin";
import { Personalization } from "./personalization";
import { RestrictionsAlert } from "./restrictions-alert";
import { Size } from "./size";
import { Tab, Tabs } from "./tabs";

const install = Vue => {
    Vue.component("component-plugin", ComponentPlugin);
    Vue.component("personalization", Personalization);
    Vue.component("restrictions-alert", RestrictionsAlert);
    Vue.component("size", Size);
    Vue.component("tab", Tab);
    Vue.component("tabs", Tabs);

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
    Personalization,
    RestrictionsAlert,
    Size,
    Tab,
    Tabs
};

export const InitialsImages = personalizationForm.InitialsImages;
export const InitialsInputs = personalizationForm.InitialsInputs;

export { personalizationForm, sizeForm };

export default install;
