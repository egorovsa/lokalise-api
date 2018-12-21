const path = require('path');
const process = require('process');
const nodeExternals = require('webpack-node-externals');
const production = process.env.NODE_ENV && process.env.NODE_ENV === 'production';

module.exports = {
    target: "node",
    externals: [ nodeExternals() ],
    entry: {
        index: './src/index.ts'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, "./lib"),
        libraryTarget: 'commonjs'
    },
    watch: !production,
    resolve: {
        extensions: [ ".ts", ".tsx", ".js", ".json" ]
    },
    mode: production ? "production" : "development",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
            }
        ]
    }
};
