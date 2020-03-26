const modalMixin = {
    data: function() {
        return {
            modalComponent: null,
            modalOptions: {
                name: "",
                visible: false,
                overlayLeave: true
            }
        };
    },
    mounted: function() {
        // tries to find the first modal component that is a child
        // of the current component (if any)
        this.modalComponent = this.$children.find(
            child => child.constructor.options.name === "modal"
        );

        // in case it was not possible to find a valid modal under
        // the direct children list then an exception is raised as
        // the modal mixin would not work under such conditions
        if (!this.modalComponent) {
            throw Error("No modal component found in component children");
        }

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
        showModal(...args) {
            const show = this.willShowModal(...args);
            if (show !== false) this.modalOptions.visible = true;
        },
        hideModal(...args) {
            const hide = this.willHideModal(...args);
            if (hide !== false) this.modalOptions.visible = false;
        },
        willShowModal(...args) {
            return true;
        },
        willHideModal(...args) {
            return true;
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
