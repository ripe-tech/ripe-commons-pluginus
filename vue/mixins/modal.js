const modalMixin = {
    data: function() {
        return {
            modalComponent: null,
            modalOptions: {
                name: "",
                visible: false,
                backgroundLeave: true
            }
        };
    },
    mounted: function() {
        this.modalComponent = this.$children.find(
            child => child.constructor.options.name === "modal"
        );
        this.modalComponent.options = this.modalOptions;

        this.modalComponent.$on("hide", this.hideModal);
        this.modalComponent.$on("show", this.showModal);
        this.modalComponent.$on("key_pressed", this.modalKeyPressed);
        this.modalComponent.$on("before_enter", this.modalBeforeEnter);
        this.modalComponent.$on("enter", this.modalEnter);
        this.modalComponent.$on("after_enter", this.modalAfterEnter);
        this.modalComponent.$on("enter_cancelled", this.modalEnterCancelled);
        this.modalComponent.$on("before_leave", this.modalBeforeLeave);
        this.modalComponent.$on("leave", this.modalLeave);
        this.modalComponent.$on("after_leave", this.modalAfterLeave);
        this.modalComponent.$on("leave_cancelled", this.modalLeaveCancelled);
    },
    watch: {
        modalOptions() {
            this.modalComponent.options = this.modalOptions;
        }
    },
    methods: {
        willHideModal() {
            return true;
        },
        hideModal(...args) {
            const hide = this.willHideModal(...args);
            if (hide) {
                this.modalOptions.visible = false;
            }
        },
        willShowModal() {
            return true;
        },
        showModal(...args) {
            const show = this.willShowModal(...args);
            if (show) {
                this.modalOptions.visible = true;
            }
        },
        modalShown() {},
        modalHidden() {},
        modalKeyPressed(key) {},
        modalBeforeEnter() {},
        modalEnter() {},
        modalAfterEnter() {
            this.modalShown();
        },
        modalEnterCancelled() {},
        modalBeforeLeave() {},
        modalLeave() {},
        modalAfterLeave() {
            this.modalHidden();
        },
        modalLeaveCancelled() {}
    }
};

export { modalMixin };
