import { locale } from "./locale";

export const install = Vue => {
    Vue.filter("locale", locale);
};

export { locale };

export default install;
