
import Demobox from '../../../lib'
import yaml from 'js-yaml'
import fs from 'fs'

export default class Server {
  constructor(config) {
    this.config = config
    this.db = new Demobox(config)
    this.data = this.db.generate()
  }

  updatePage(req, res) {
    const file = req.body
    if (file.type !== 'page') return res.send('not a page')
    const rawBody = file.rawBody
    const sourcePath = file.sourcePath
    delete file.rawBody
    console.log(sourcePath)
    const extras = ['type', 'source', 'sourcePath', 'dest', 'rawSource']
    extras.forEach(name => {delete file[name]})
    const meta = yaml.dump(file)
    const raw = '<!--\n---\n\n' + meta + '\n\n---\n-->\n\n' + rawBody
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

