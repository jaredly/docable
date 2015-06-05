
import fs from 'fs'
import path from 'path'
import async from 'async'

export {walk, objMap, callIf}

function walk(dir, curpath, files, done) {
  console.log('walk', dir, curpath)
  fs.readdir(dir, (err, flist) => {
    const tasks = []

    flist.forEach(name => {
      if (name[0] === '.') return
      const ext = path.extname(name) 
      const fullpath = path.join(dir, name)
      const relpath = path.join(curpath, name)
      console.log(name, curpath, relpath)
      tasks.push(next => {
        fs.stat(fullpath, (err, stat) => {
          console.log('stating', name, relpath)
          if (stat.isDirectory()) {
            walk(fullpath, relpath, files, next)
          } else {
            files.push(relpath)
            next(null)
          }
        })
      })
    })

    async.parallel(tasks, done)
  })
}

function objMap(obj, fn) {
  return Object.keys(obj).reduce((nobj, key) => (nobj[key] = fn(key, obj[key]), nobj), {})
}

function callIf(plugins, fn, ...args) {
  plugins.forEach(plugin => {
    if (plugin[fn]) {
      plugin[fn](...args)
    }
  })
}

