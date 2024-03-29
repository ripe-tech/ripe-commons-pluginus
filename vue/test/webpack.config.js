const path = require("path");
const vueLoader = require("vue-loader");

const VueLoaderPlugin = vueLoader.VueLoaderPlugin;

module.exports = {
    entry: "./vue",
    target: "node",
    mode: "development",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "ripe-commons-pluginus-test.min.js",
        library: "RipeCommonsPluginusTest",
        libraryTarget: "umd",
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
    },
    plugins: [new VueLoaderPlugin({})],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        js: "babel-loader",
                        scss: "vue-style-loader!css-loader!sass-loader",
                        sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
                    },
                    optimizeSSR: false
                }
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ["null-loader"]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            sourceType: "unambiguous",
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: { node: "10" },
                                        useBuiltIns: "entry",
                                        corejs: "3"
                                    }
                                ]
                            ],
                            plugins: [
                                [
                                    "@babel/plugin-transform-runtime",
                                    {
                                        regenerator: true
                                    }
                                ]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                type: "asset/inline"
            },
            {
                resourceQuery: /raw/,
                type: "asset/source"
            }
        ]
    },
    resolve: {
        alias: {
            base$: "../../../js",
            vue$: "vue/dist/vue.esm.js"
        },
        fallback: {
            fs: false,
            path: false,
            http: false,
            https: false
        }
    },
    performance: {
        hints: false
    },
    devtool: "inline-source-map"
};
