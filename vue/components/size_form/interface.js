const notImplementedMessage = method => "Method " + method + " not implemented";

export const formInterface = {
    methods: {
        /**
         * Called just before the modal window containing the size form
         * is shown.
         */
        show() {},

        /**
         * Called just before the modal window containing the size form
         * is hidden.
         */
        hide() {},

        /**
         * Should restore the internal state of the size form
         * back to the original empty values.
         */
        reset() {
            throw notImplementedMessage("reset");
        },

        setState(state) {
            throw notImplementedMessage("setState");
        },

        getState() {
            throw notImplementedMessage("getState");
        },

        /**
         * Returns a string that is going to be used as a label representing
         * the current state of the size to be shown to the user.
         */
        getSizeText() {
            throw notImplementedMessage("getSizeText");
        }

        /**
         * @events
         *
         * "changed" with the instance as parameter, should be called whenever
         * the state is changed
         */
    }
};

export default formInterface;
