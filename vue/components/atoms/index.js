import { Button } from "./button/button.vue";
import { Icon } from "./icon/icon.vue";
import { SummaryDetails } from "./summary-details/summary-details.vue";

const install = Vue => {
    Vue.component("button-ripe", Button);
    Vue.component("icon", Icon);
    Vue.component("summary-details", SummaryDetails);
};

export { Button, Icon, SummaryDetails };

export default install;
