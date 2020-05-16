const qiniu = require('qiniu')

class UploadQiniuWebpackPlugin {
  constructor(options) {
    this.options = options
  };
  apply(compiler) {
    compiler.hooks.done.tap(
      'UploadQiniuWebpackPlugin',
      (compilation, callback) => {
      const mac = new qiniu.auth.digest.Mac(this.options.accessKey, this.options.secretKey);
      const options = {
        scope: this.options.bucket,
        expires: 7200
      };
      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken=putPolicy.uploadToken(mac);
      let config = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z2;
      const formUploader = new qiniu.form_up.FormUploader(config);
      let _ = this
      for (let filename in compilation.compilation.assets) {
        let putExtra = new qiniu.form_up.PutExtra(filename);
        formUploader.putFile(uploadToken, this.options.online_path + filename, this.options.local_path + filename, putExtra, function(respErr, respBody, respInfo) {
          _.options.response(respErr, respBody, respInfo)
        });
      }
      }
    );
  };
}

module.exports = UploadQiniuWebpackPlugin
