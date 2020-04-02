import Atoms from "./atoms";
import Forms from "./forms";
import Molecules from "./molecules";
import Organisms from "./organisms";
import Logic from "./logic";

const install = Vue => {
    Vue.use(Atoms);
    Vue.use(Forms);
    Vue.use(Molecules);
    Vue.use(Organisms);
    Vue.use(Logic);
};

export * from "./atoms";
export * from "./forms";
export * from "./molecules";
export * from "./organisms";
export * from "./logic";

export { install };

export default install;
