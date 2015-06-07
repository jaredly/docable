
import path from 'path'
import fs from 'fs'
import send from 'send'

export default config => function themeAssets(req, res) {
  const parts = req.path.slice(1).split('/')
  const theme = parts.shift()
  const relpath = parts.join('/')

  // const realpath = path.join(config.theme.basedir, relpath)

  send(req, relpath, {root: config.theme.basedir}).pipe(res);

  /*
  if (relpath.endsWith('.css')) {
    res.set('Content-Type', 'text/css')
    res.send(fs.readFileSync(realpath).toString('utf8'))
  } else {
    res.send(fs.readFileSync(realpath))
  }
  */
}

