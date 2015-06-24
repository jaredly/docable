
import Demobox from '../../../lib'
import yaml from 'js-yaml'
import path from 'path'
import send from 'send'
import fs from 'fs'

export default class Server {
  constructor(config) {
    this.config = config
    this.db = new Demobox(config)
    this.data = this.db.generate()
  }

  getPage(req, res, next) {
    const url = req.path.slice(1)
    this.data.then(files => {
      const found = files.some(file => {
        if (file.dest !== url) return
        if (file.type === 'page') {
          res.send(file.rendered)
        } else {
          send(req, file.sourcePath).pipe(res);
        }
        return true
      })
      if (!found) {
        next()
      }
    }).catch(err => {
      console.log('Failed')
      console.log(err)
      console.log(err.stack)
    })
  }

  updatePage(req, res) {
    const file = req.body
    if (file.type !== 'page') return res.send('not a page')
    const sourcePath = file.sourcePath || path.join(this.config.baseDir, this.config.source, file.source)
    const raw = toRaw(this.config, file)
    fs.writeFileSync(sourcePath, raw)
    res.send('awesome')
    this.data = this.db.generate()
  }

  getData(req, res) {
    this.data.then(files => {
      res.set('content-type', 'application/json')
      res.send(files)
      res.end()
    }, err => {
      console.log('fail', err)
      res.send('fail')
    })
  }
}

const FENCES = {
  comment: ['<!-- @frontmatter\n', '\n-->\n'],
  normal: ['---\n', '\n---\n'],
}

function toRaw(config, file) {
  const rawBody = file.rawBody
  delete file.rawBody
  const isReadme = file.source.toLowerCase().endsWith('readme.md')
  const extras = ['type', 'source', 'sourcePath', 'dest', 'rawSource']
  extras.forEach(name => {delete file[name]})
  const meta = yaml.dump(file)
  const fence = FENCES[isReadme ? 'comment' : 'normal']
  return fence[0] + meta + fence[1] + rawBody
}

