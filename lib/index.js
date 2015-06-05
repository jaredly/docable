
import RCSS from 'rcss'
import React from 'react'
import async from 'async'
import deepmerge from 'deepmerge'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import fsExtra from 'fs-extra'
import assign from 'object-assign'

import render from './render'

import css from './css'
import parseData from './parse'
import theme2page from './page'
import {walk, objMap, callIf} from './utils'
import {pluginPages} from './cheap-utils'

export default class Demobox {
  constructor(config) {
    this.config = config

    const stylesObj = config.theme.styles(config.themeConfig)
    const {styles, decs} = css.groups(stylesObj)

    this.styles = styles
    this.styleString = RCSS.getStylesString()
  }

  generate() {
    return this.pipeline([
      '_collectPaths',
      '_readFiles',
      '_preprocess',
      '_generate',
      '_render',
      '_postprocess',
    ])
  }

  write(pages) {
    return Promise.all(pages.map(page => this._writeFile(page)))
  }

  pipeline(pipeline) {
    let p = Promise.resolve()
    pipeline.forEach(name => p = p.then(val => {
      console.log('[]', name)
      return this[name](val)
    }))
    return p
  }

  // nil => paths
  _collectPaths() {
    return Promise.all([
      this._walkSourceTree(),
      collectPluginArray(
        this.config.plugins,
        'sourcePaths',
        [this.config],
      )
    ]).then(([source, extra]) => source.concat(extra))
  }

  // paths => files
  _readFiles(paths) {
    return Promise.all(paths.map(path => this._readFile(path)))
  }

  // files => files
  _preprocess(files) {
    return this._doPlugins(files, 'preprocess')
  }

  // files => files + generated files
  _generate(files) {
    return collectPluginArray(
      this.config.plugins,
      'generate',
      [this.config, files]
    ).then(newFiles => files.concat(newFiles))
  }

  // files => rendered files
  _render(files) {
    return files.map(file => {
      if (file.type === 'page') {
        file.rendered = this._renderFile(file)
      }
      return file
    })
  }

  // files => files
  _postprocess(files) {
    return this._doPlugins(files, 'postprocess')
  }

  //

  _walkSourceTree() {
    const files = []
    return prom(done => walk(this.config.source, '', files,
                             err => done(err, files)))
  }

  _doPlugins(files, attr) {
    this.config.plugins.forEach(plugin => {
      if (!plugin[attr]) return
      files.forEach(file => plugin[attr](this.config, file))
    })
    return files
  }

  _readFile(file) {
    if ('string' === typeof file) {
      file = {
        source: file,
      }
    }
    if (!file.sourcePath) {
      file.sourcePath = path.join(this.config.source, file.source)
    }
    const ext = path.extname(file.source)
    // TODO allow other kinds of source files
    if (ext !== '.md') {
      file.type = 'asset'
      if (!file.dest) file.dest = file.source
      return file
    }
    return prom(done => fs.readFile(file.sourcePath, 'utf8', done))
      .then(contents => parseFile(file, contents))
  }

  _renderFile(file) {
    console.log('> Rendering', file.sourcePath)
    const plugins = pluginPages(this.config.plugins, file)

    const themeBase = path.relative(path.dirname(file.dest), 'themes')

    if (!file.body && file.rawBody) {
      file.body = render(file.rawBody)
    }

    const themeData = this.config.theme.page(
      file,
      this.config.themeConfig,
      plugins
    )

    const html = theme2page({
      file, themeData, plugins,
      styles: this.styles,
      styleString: this.styleString,
      asset: assetpath => {
        if (assetpath.indexOf('://') !== -1) return assetpath
        return path.join(themeBase, 'default', assetpath)
      },
    })
    return html
  }

  _writeFile(file) {
    const outPath = path.join(this.config.dest, file.dest)
    if (file.type === 'asset') {
      return prom(done => fsExtra.copy(file.sourcePath, outPath, done))
    }

    prom(done => mkdirp(path.dirname(outPath), err => {
      if (err) return done(err)
      fs.writeFile(outPath, file.rendered, done)
    }))
  }

  /*
  generate(done) {
    const plugins = this.config.plugins
    console.log('Collecting files')
    this.collectFiles((err, files) => {
      if (err) return done(err)
      callIf(plugins, 'gatherFiles', files)

      console.log('Processing files')
      this.processDirectory(files, '', (err, files) => {
        if (err) return done(err)
        const derived = {}
        callIf(plugins, 'derivedFiles', derived, files)
        console.log('Processing derived files')
        this.processDirectory(derived, '', (err, derived) => {
          if (err) return done(err)
          const allFiles = deepmerge(files, derived)
          callIf(plugins, 'postProcessFiles', allFiles)
          console.log('Writing files')
          this.writeFiles(allFiles, '', err => {
            if (err) return done(err)
            this.copyAssets(done)
          })
        })
      })
    })
  }

  collectFiles(done) {
    walk(this.config.source, '', done)
  }

  processDirectory(files, path, done) {
    const tasks = objMap(files, name => next => {
      if (!files[name]) return next()
      if (name === '$type') return next(null, files[name])
      const fpath = path + '/' + name
      if (files[name].$type === 'folder') {
        return this.processDirectory(files[name], fpath, next)
      }
      this.processFile(fpath, files[name], next)
    })
    async.parallel(tasks, done)
  }

  processFile(outpath, file, next) {
    if ('string' !== typeof file) {
      if (!file.body && file.rawBody) {
        file.body = render(file.rawBody)
      }
      return next(null, file)
    }
    if (path.extname(file) !== '.md') return next(null, {
      $type: 'asset',
      fileName: file,
      outFileName: outpath,
    })
    file = {
      fileName: file,
    }
    fs.readFile(path.join(this.config.source, file.fileName), 'utf8', (err, raw) => {
      if (err) return next(err)
      const parsed = parseData(raw) || {
        rawBody: raw,
        title: 'Untitled',
      }
      const pageData = deepmerge(parsed, file)
      pageData.$type = 'page'
      pageData.body = render(pageData.rawBody)
      pageData.outFileName = outpath

      next(null, pageData)
    })
  }

  writeFiles(files, basepath, done) {
    const tasks = objMap(files, name => next => {
      if (name === '$type') return next(null, files[name])
      const curpath = basepath + '/' + name
      if (files[name].$type === 'folder') {
        return this.writeFiles(files[name], curpath, next)
      }
      this.writeFile(files[name], curpath, next)
    })
    async.parallel(tasks, done)
  }

  __writeFile(pageData, curpath, done) {
    const config = this.config

    const sourcePath = path.join(this.config.source,pageData.fileName)
    const outpath = path.join(this.config.dest, pageData.outFileName)
    console.log('> Writing', pageData.$type, sourcePath, outpath)
    if (pageData.$type === 'asset') {
      return fsExtra.copy(sourcePath, outpath, done)
    }

    const plugins = pluginPages(config.plugins, pageData, curpath)

    const themeBase = path.relative(path.dirname(curpath), '/themes')

    const themeData = config.theme.page(
      pageData,
      config.themeConfig,
      plugins
    )

    const html = theme2page({
      pageData, themeData, plugins,
      styles: this.styles,
      styleString: this.styleString,
      asset: assetpath => {
        if (assetpath.indexOf('://') !== -1) return assetpath
        return path.join(themeBase, 'default', assetpath)
      },
    })

    mkdirp(path.dirname(outpath), err => {
      if (err) return done(err)
      fs.writeFile(outpath, html, done)
    })
  }

  copyAssets(done) {
    const theme = this.config.theme
    const tasks = theme.assets.map(relpath => next => {
      const src = path.join(theme.basedir, relpath)
      const dest = path.join(this.config.dest, 'themes', theme.name, relpath)
      mkdirp(path.dirname(dest), err => {
        fsExtra.copy(src, dest, next)
      })
    })

    async.parallel(tasks, done)
  }
  */
}

function prom(fn) {
  return new Promise((res, rej) => fn((err, val) => {
    if (err) return rej(err)
    res(val)
  }))
}

function collapseArray(vals) {
  let res = []
  vals.forEach(val => {
    if (Array.isArray(val)) {
      res = res.concat(val)
    } else {
      res.push(val)
    }
  })
  return res
}

function parseFile(file, contents) {
  return assign({
    type: 'page',
    rawSource: contents,
    dest: file.source.slice(0, -path.extname(file.source).length) + '.html'
  }, parseData(contents), file)
}

/**
 * plugin[attr] can be
 * 1 a value
 * 2 an array
 * 3 a promise to 1 | 2
 * 4 a function to 1-3
 *
 * returns a promise to the final flattened array of values.
 */
function collectPluginArray(plugins, attr, args, fn) {
  const res = []
  plugins.forEach(plugin => {
    if (!plugin[attr]) return
    let val = plugin[attr]
    if ('function' === typeof val) {
      val = val.apply(null, args)
    }
    res.push(val)
  })
  return Promise.all(res).then(collapseArray)
}

