
import express from 'express'
import bodyParser from 'body-parser'

import iframe from './iframe'
import themeAssets from './theme-assets'
import getAssets from './get-assets'
import Server from './server'

export default function setupApp(app, config) {
  const server = new Server(config)
  app.use(bodyParser())
  app.get('/admin/api/data', server.getData.bind(server))
  app.post('/admin/api/pages', server.updatePage.bind(server))
  app.get('/admin/iframe', iframe(config))
  app.use('/admin/theme-assets', themeAssets(config))
  app.use('/themes', themeAssets(config))
  app.use('/admin/assets', getAssets)
  app.use('/admin', express.static(__dirname + '/../static/'))
  app.use('/', server.getPage.bind(server))
  // app.use('/admin', express.static(__dirname + '/../build/'))
}

