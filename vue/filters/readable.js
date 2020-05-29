import Vue from "vue";

export const readable = value => {
    if (!value) {
        return "";
    }
    value = value.toString();
    return value.split("_").join(" ");
};

Vue.filter("readable", readable);
