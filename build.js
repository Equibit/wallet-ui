var stealTools = require('steal-tools');
var path = require('path');

stealTools.build({
  config: path.join(__dirname, '/package.json!npm')
}, {
  bundleAssets: true,
  uglifyOptions: {
    mangle: { 'keep_fnames': true }
  }
});
