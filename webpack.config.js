const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");

const entries = {};
const srcDir = path.join(__dirname, "src");
fs.readdirSync(srcDir)
  .filter(dir => fs.statSync(path.join(srcDir, dir)).isDirectory())
  .forEach(dir => (entries[dir] = "./" + path.join("src", dir, dir)));

module.exports = {
    entry: entries,
    output: {
        publicPath: "/dist/",
        filename: "[name]/[name].js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "azure-devops-extension-sdk": path.resolve("node_modules/azure-devops-extension-sdk")
        }
    },
    stats: {
        warnings: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "azure-devops-ui/buildScripts/css-variables-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.woff$/,
                use: [{
                    loader: 'base64-inline-loader'
                }]
            },
            {
                test: /\.html$/,
                loader: "file-loader"
            },
            {
                test: /\.json$/,
                loader: 'raw-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin([ { from: "**/*.html", context: "src" }]),
        new CopyPlugin([ { from: '*.txt', context: 'assets', to: '[name].json',
              transform(content, path) {
                var array = content.toString().replace(/\r?\n|\r/g, ";").trim(';').split(";").sort();
                return JSON.stringify(array, null, 2);
              }
            }
        ])
    ],
    target: "web",
    devtool: "inline-source-map",
    devServer: {
      https: true,
      port: 3000
    }
};
