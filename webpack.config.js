const path = require("path");
const webpack = require("webpack");

const config = require("uxf-webpack/config/webpack.config.full");

const TerserPlugin = require("terser-webpack-plugin");

const info = require("./package.json");

const banner = [
    "ripe-commons-pluginus v" + info.version,
    "(c) 2010-" + new Date().getFullYear() + " " + info.author,
    info.homepage
].join("\n");

config.entry = "./index.js";
config.output.path = path.join(__dirname, "dist");
config.output.filename = "ripe-commons-pluginus.min.js?[hash]";
config.output.library = "RipeCommonsPluginus";
config.output.publicPath = "/";

config.optimization = {
    concatenateModules: false,
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                keep_fnames: true,
                keep_classnames: true
            }
        })
    ]
};

config.externals = config.externals || {};
config.externals.vue = "vue";

config.plugins.push(new webpack.BannerPlugin(banner));

config.module.rules = config.module.rules.filter(rule => rule.loader !== "file-loader");
config.module.rules.push({
    test: /\.(png|jpg|gif|svg|ico)$/,
    loader: "url-loader"
});

module.exports = config;
