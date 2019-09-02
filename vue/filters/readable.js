import Vue from "vue";

const readable = value => {
    if (!value) {
        return "";
    }
    value = value.toString();
    return value.split("_").join(" ");
};

Vue.filter("readable", readable);

export { readable };
