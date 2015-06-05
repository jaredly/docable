
import express from 'express'

import iframe from './iframe'
import themeAssets from './theme-assets'

export default function setupApp(app, config) {
  const server = new Server(config)
  app.get('/admin/api/data', server.getData.bind(server))
  app.get('/admin/api/posts/:id', server.getPost.bind(server))
  app.post('/admin/api/posts/:id', server.updatePost.bind(server))
  app.get('/admin/iframe', iframe(config))
  app.use('/admin/theme-assets', themeAssets(config))
  // app.use('/admin', express.static(__dirname + '/../build/'))
  app.use('/admin', express.static(__dirname + '/../static/'))
}

