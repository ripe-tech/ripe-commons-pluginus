const notImplementedMessage = method => "Method " + method + " not implemented";

export const Interface = {
    methods: {
        /**
         * Called just before the modal window containing the personalization
         * is shown.
         */
        show() {},

        /**
         * Called just before the modal window containing the personalization
         * is hidden.
         */
        hide() {},

        /**
         * Should restore the internal state of the personalization
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
         * the current state of the personalization in the tab panel.
         */
        getTabMessage() {
            throw notImplementedMessage("getTabMessage");
        }

        /**
         * @events
         *
         * "changed" with the instance as parameter, should be called whenever
         * the state is changed
         */
    }
};

export default Interface;
