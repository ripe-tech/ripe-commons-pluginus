import * as personalizationForm from "./personalization-form";
import * as sizeForm from "./size-form";

const install = Vue => {
    Vue.component("initials-images", personalizationForm.InitialsImages);
    Vue.component("initials-inputs", personalizationForm.InitialsInputs);
};

export const InitialsImages = personalizationForm.InitialsImages;
export const InitialsInputs = personalizationForm.InitialsInputs;

export { personalizationForm, sizeForm };

export default install;
