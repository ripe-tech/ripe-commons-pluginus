import Atoms from "./atoms";
import Forms from "./forms";
import Molecules from "./molecules";
import Logic from "./logic";
import { Personalization } from "./personalization";
import { RestrictionsAlert } from "./restrictions-alert";
import { Size } from "./size";

const install = Vue => {
    Vue.component("personalization", Personalization);
    Vue.component("restrictions-alert", RestrictionsAlert);
    Vue.component("size", Size);

    Vue.use(Atoms);
    Vue.use(Forms);
    Vue.use(Molecules);
    Vue.use(Logic);
};

export * from "./atoms";
export * from "./forms";
export * from "./molecules";
export * from "./logic";

export { install, Personalization, RestrictionsAlert, Size };

export default install;
