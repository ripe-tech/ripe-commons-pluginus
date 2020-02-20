import { Button } from "./button/button.vue";
import { SummaryDetails } from "./summary-details/summary-details.vue";

const install = Vue => {
    Vue.component("button-ripe", Button);
    Vue.component("summary-details", SummaryDetails);
};

export { Button, SummaryDetails };

export default install;
