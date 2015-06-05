
import {theme2html, theme2head} from '../../../lib/page'
import path from 'path'
import fs from 'fs'

export default config => function themeAssets(req, res) {
  const parts = req.path.slice(1).split('/')
  const theme = parts.shift()
  const relpath = parts.join('/')

  const realpath = path.join(config.theme.basedir, relpath)

  res.set('content-type', 'text/css')
  res.send(fs.readFileSync(realpath))
}

