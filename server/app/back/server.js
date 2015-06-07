
import Demobox from '../../../lib'
import yaml from 'yamlish'
import fs from 'fs'

export default class Server {
  constructor(config) {
    this.config = config
    this.db = new Demobox(config)
    this.data = this.db.generate()
  }

  updatePage(req, res) {
    const file = req.body
    const rawBody = file.rawBody
    const sourcePath = file.sourcePath
    delete file.rawBody
    const extras = ['source', 'sourcePath', 'dest', 'rawSource']
    extras.forEach(name => {delete file[name]})
    const meta = yaml.encode(file)
    const raw = '<!--\n---\n\n' + meta + '\n\n---\n-->\n\n' + rawBody
    fs.writeFileSync(sourcePath, raw)
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

