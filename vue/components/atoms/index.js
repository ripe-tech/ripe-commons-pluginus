import { Button } from "./button/button.vue";
import { Icon } from "./icon/icon.vue";

const install = Vue => {
    Vue.component("button-ripe", Button);
    Vue.component("icon", Icon);
};

export { Button, Icon };

export default install;
