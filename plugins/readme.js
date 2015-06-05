
import path from 'path'
import assign from 'object-assign'

module.exports = readme => ({
  sourcePaths(config) {
    return [{
      sourcePath: path.join(config.baseDir, readme),
      source: readme,
      dest: 'index.html',
    }]
  },
})

assign(module.exports, module.exports('Readme.md'))

