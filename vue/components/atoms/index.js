import { Alert } from "./alert/alert.vue";
import { Button } from "./button/button.vue";
import { ButtonPlatforme } from "./button-platforme/button-platforme.vue";
import { Dot } from "./dot/dot.vue";
import { Icon } from "./icon/icon.vue";
import { Loader } from "./loader/loader.vue";
import { Thumbnail } from "./thumbnail/thumbnail.vue";

const install = Vue => {
    Vue.component("alert", Alert);
    Vue.component("button-ripe", Button);
    Vue.component("button-platforme", ButtonPlatforme);
    Vue.component("dot", Dot);
    Vue.component("icon", Icon);
    Vue.component("loader", Loader);
    Vue.component("thumbnail", Thumbnail);
};

export { Alert, Button, ButtonPlatforme, Dot, Icon, Loader, Thumbnail };

export default install;
