import { Alert } from "./alert/alert.vue";
import { Button } from "./button/button.vue";
import { ButtonPlatforme } from "./button-platforme/button-platforme.vue";
import { ErrorAlert } from "./error-alert/error-alert.vue";
import { Icon } from "./icon/icon.vue";
import { Image } from "./image/image.vue";
import { Loader } from "./loader/loader.vue";
import { Thumbnail } from "./thumbnail/thumbnail.vue";

const install = Vue => {
    Vue.component("alert", Alert);
    Vue.component("button-ripe", Button);
    Vue.component("button-platforme", ButtonPlatforme);
    Vue.component("error-alert", ErrorAlert);
    Vue.component("icon", Icon);
    Vue.component("image-ripe", Image);
    Vue.component("loader", Loader);
    Vue.component("thumbnail", Thumbnail);
};

export { Alert, Button, ButtonPlatforme, ErrorAlert, Icon, Image, Loader, Thumbnail };

export default install;
