const path = require("path");
const webpack = require("webpack")
module.exports = {
    entry: {
        "artifacts": "./src/index.ts",
        "artifacts.min": "./src/index.ts"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".ts", ".js", ".json"]
    },
    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {
                test: /\.ts?$/,
                use: [
                    "awesome-typescript-loader"
                 ],
                exclude: [
                    /node_modules/,
                    /test/
                ]
            }
        ]
    },
}