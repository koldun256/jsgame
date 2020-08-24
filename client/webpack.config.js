const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	entry: "./src/Components/App.js",
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			},
			{
				test: /\.(png|ico)$/,
				use: [
					{
						loader: 'file-loader'
					}
				]
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	resolve: {
		alias: {
			Components: path.join(__dirname, 'src/Components'),
			Other: path.join(__dirname, 'src/other-js'),
			Assets: path.join(__dirname, 'src/assets'),
			Hooks: path.join(__dirname, 'src/Hooks')
		}
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html",
			favicon: './src/assets/favicon.ico'
		})
	],
	output: {
		filename: "[contenthash].bundle.js",
		path: path.resolve(__dirname, "dist")
	}
};
