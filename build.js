var stealTools = require('steal-tools')
var path = require('path')

stealTools.build({
  config: path.join(__dirname, '/package.json!npm'),
  main: [
    'wallet-ui/index.stache!done-autorender/src/no-zone',
    'wallet-ui/workers/derive-keys-worker'
  ]
}, {
  bundleAssets: true,
  uglifyOptions: {
    keep_fnames: true
  }
})
