
import path from 'path'
import fs from 'fs'
import send from 'send'

export default config => function themeAssets(req, res) {
  const parts = req.path.slice(1).split('/')
  const theme = parts.shift()
  const relpath = parts.join('/')

  send(req, relpath, {root: config.theme.basedir}).pipe(res);
}

