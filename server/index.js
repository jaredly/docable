
import express from 'express'
import path from 'path'

import makeWebpack from './app/back/webpack'
import setupApp from './app/back'

const configPath = path.join(__dirname, '../.demobox.js')
const config = require(configPath)
config.baseDir = path.dirname(configPath)

let app
if (true) {
  const webpackConfig = require('./webpack.config.js')
  webpackConfig.resolve.alias['docable$config'] = configPath
  app = makeWebpack(webpackConfig)
  setupApp(app.app, config)
} else {
  app = express()
  setupApp(app, config)
}

app.listen(4011, err => {
  console.log('listening')
})

