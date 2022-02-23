const path = require("path");

module.exports = async ({ config, mode }) => {
    config.resolve.fallback = {
        fs: false,
        http: false,
        https: false,
        path: false
    };
    config.module.rules.push({
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, "../")
    });
    config.module.rules.push({
        test: /\.stories\.jsx?$/,
        use: [require.resolve("@storybook/source-loader")],
        enforce: "pre"
    });
    config.module.rules.push({
        resourceQuery: /raw/,
        type: "asset/source"
    });
    return config;
};
