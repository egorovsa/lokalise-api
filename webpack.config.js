const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	target: "node",
	externals: [nodeExternals()],
	entry: {
		index: './src/ts/index.ts'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, "./lib"),
		libraryTarget: 'umd',
		library: 'LokaliseCo',
		umdNamedDefine: true
	},
	watch: true,
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	mode: "development",
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
