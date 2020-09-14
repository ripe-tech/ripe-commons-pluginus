const notImplementedMessage = method => "Method " + method + " not implemented";

export const Interface = {
    methods: {
        /**
         * Returns an array of strings containing the queries of the models
         * that are going to appear in the suggestions list.
         */
        getQueries() {
            throw notImplementedMessage("getQueries");
        }
    }
};

export default Interface;
