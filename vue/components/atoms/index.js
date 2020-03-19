import { Button } from "./button/button.vue";
import { ButtonPlatforme } from "./button-platforme/button-platforme.vue";
import { Icon } from "./icon/icon.vue";

const install = Vue => {
    Vue.component("button-ripe", Button);
    Vue.component("button-platforme", ButtonPlatforme);
    Vue.component("icon", Icon);
};

export { Button, Icon, ButtonPlatforme };

export default install;
