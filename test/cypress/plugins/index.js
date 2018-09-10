// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const options = webpack.defaultOptions
  options.webpackOptions.module.rules[0].use[0].options.presets.push('babel-preset-stage-3')
  on('file:preprocessor', webpack(options))

  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args = args.filter((arg) => {
        return arg !== '--disable-blink-features=RootLayerScrolling'
      })
      return args
    }
  })
}
