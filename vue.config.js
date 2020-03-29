const path = require("path");
module.exports = {
  //   pluginOptions: {
  //     "style-resources-loader": {
  //       preProcessor: "less",
  //       patterns: [path.resolve(__dirname, "./src/assets/style/common.less")]
  //     }
  //   },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/assets/style/variable.less")] // 引入全局样式变量
    }
  },
 
};
