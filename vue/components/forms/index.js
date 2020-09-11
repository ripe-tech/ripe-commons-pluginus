import * as personalizationForm from "./personalization-form";
import * as sizeForm from "./size-form";
import * as suggestionsForm from "./suggestions-form";

const install = Vue => {
    Vue.component("initials-images", personalizationForm.InitialsImages);
    Vue.component("initials-inputs", personalizationForm.InitialsInputs);
    Vue.component("suggestions-list", suggestionsForm.SuggestionsList);
};

export const InitialsImages = personalizationForm.InitialsImages;
export const InitialsInputs = personalizationForm.InitialsInputs;
export const SuggestionsList = suggestionsForm.SuggestionsList;

export { personalizationForm, sizeForm, suggestionsForm };

export default install;
