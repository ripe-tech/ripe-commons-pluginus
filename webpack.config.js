const path = require("path");
const webpack = require("webpack");
const eslintWebpackPlugin = require("eslint-webpack-plugin");

const vueLoader = require("vue-loader");

const VueLoaderPlugin = vueLoader.VueLoaderPlugin;
const ESLintPlugin = eslintWebpackPlugin;

const info = require("./package.json");

const banner = [
    "ripe-commons-pluginus v" + info.version,
    "(c) 2010-" + new Date().getFullYear() + " " + info.author,
    info.homepage
].join("\n");

const config = {
    entry: "./index.js",
    target: process.env.WP_TARGET || "web",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "ripe-commons-pluginus.min.js?[fullhash]",
        library: "RipeCommonsPluginus",
        libraryTarget: "umd",
        publicPath: "/"
    },
    devServer: {
        compress: false,
        hot: true,
        historyApiFallback: true,
        watchFiles: ["js/**/*", "vue/**/*"]
    },
    plugins: [
        new VueLoaderPlugin({}),
        new ESLintPlugin({
            extensions: ["js", "jsx", "vue"]
        }),
        new webpack.BannerPlugin(banner)
    ],
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
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!ripe-sdk)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            sourceType: "unambiguous",
                            presets: [
                                process.env.NODE_ENV === "development"
                                    ? [
                                          "@babel/preset-env",
                                          {
                                              targets: {
                                                  browsers: ["last 2 years"]
                                              },
                                              useBuiltIns: "entry",
                                              corejs: "3"
                                          }
                                      ]
                                    : [
                                          "@babel/preset-env",
                                          {
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
    externals: {
        vue: "vue"
    },
    performance: {
        hints: false
    },
    optimization: {
        concatenateModules: false,
        minimize: false
    },
    devtool: "inline-source-map"
};

if (process.env.NODE_ENV === "production") {
    module.exports.devtool = "source-map";
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]);
}

module.exports = config;
