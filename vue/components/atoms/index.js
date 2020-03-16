import { Alert } from "./alert/alert.vue";
import { Button } from "./button/button.vue";
import { Icon } from "./icon/icon.vue";

const install = Vue => {
    Vue.component("alert", Alert);
    Vue.component("button-ripe", Button);
    Vue.component("icon", Icon);
};

export { Alert, Button, Icon };

export default install;
