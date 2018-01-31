var stealTools = require('steal-tools')
var path = require('path')

stealTools.build({
  config: path.join(__dirname, '/package.json!npm')
}, {
  bundleAssets: true,
  uglifyOptions: {
    keep_fnames: true
  }
})
