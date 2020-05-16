/* eslint-disable no-dupe-keys */
/* eslint-disable no-mixed-spaces-and-tabs */
const UglifyPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const Timestamp = new Date().getTime();
function resolve(dir) {
    return path.join(__dirname, dir);
}
function getAssetPath(assetsDir, filePath) {
    return path.posix.join(assetsDir, filePath);
}
module.exports = {
    productionSourceMap: false,
    lintOnSave: false,
    assetsDir: "assets",
    filenameHashing: true,
    css: {
        // 是否开启支持 foo.module.css 样式
        // modules: false,
        // 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
        extract: true,
        loaderOptions: {
            css: {
                // 这里的选项会传递给 css-loader
                importLoaders: 1,
            },
            less: {
                // 这里的选项会传递给 postcss-loader
                importLoaders: 1,
            },
        },
    },
    devServer: {
        proxy: {
            "/api": {
                // target: 'http://api.hlife_shop.com',
                target: "http://mallapi.hlife.com",
                // target: 'http://mallapi.hui-life.vip',
                // target: 'https://mallapi.cupsy.cn/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api": "",
                },
            },
        },
    },
    chainWebpack: (config) => {
        config.resolve.symlinks(true); // 修复热更新失效
        // 静态图片压缩
        config.module
            .rule("images")
            .use("image-webpack-loader")
            .loader("image-webpack-loader")
            .options({
                bypassOnDebug: true,
            })
            .end();
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV == "production") {
            // 为生产环境修改配置
            config.mode = "production";
            // 将每个依赖包打包成单独的js文件
            let optimization = {
                minimizer: [
                    new UglifyPlugin({
                        uglifyOptions: {
                            warnings: false,
                            compress: {
                                drop_console: true,
                                drop_debugger: false,
                                pure_funcs: ["console.log"],
                            },
                        },
                    }),
                ],
            };
            Object.assign(config, {
                optimization,
            });
        } else if(process.env.NODE_ENV == "testing") {
            config.mode = "development";
        } else {
            // 为开发环境修改配置
            config.mode = "development";
        }
        console.log(process.env.NODE_ENV)
    },
    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [path.resolve(__dirname, "src/assets/style/app.less")], // 引入全局样式变量
        },
    },
};
