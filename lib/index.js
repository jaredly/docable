
import RCSS from 'rcss'
import React from 'react'
import async from 'async'
import deepmerge from 'deepmerge'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import fsExtra from 'fs-extra'
import assign from 'object-assign'

import render from 'mark-that'

import css from './css'
import parseData from './parse'
import {theme2html, theme2head} from './page'
import {walk, objMap, callIf} from './utils'
import {pluginPages} from './cheap-utils'

export default class Demobox {
  constructor(config) {
    this.config = config
    this.renderer = render(config)

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
    return prom(done => walk(path.join(this.config.baseDir, this.config.source), '', files,
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
      file.sourcePath = path.join(this.config.baseDir, this.config.source, file.source)
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
      file.body = this.renderer(file.rawBody)
    }

    const headData = this.config.theme.head(file, this.config.themeConfig, plugins)
    addPluginsToHead(headData, plugins)

    const asset = assetpath => {
      if (assetpath.indexOf('://') !== -1) return assetpath
      return path.join(themeBase, 'default', assetpath)
    }

    const head = theme2head(headData, this.styleString, asset)
    const Page = this.config.theme.Page
    const body = React.renderToStaticMarkup(
      <Page
        file={file}
        plugins={plugins}
        styles={this.styles}/>
    )
    return theme2html(head, body)
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

function addPluginsToHead(headData, plugins) {
  const pluginScripts = plugins.reduce((scripts, plugin) => {
    if (plugin.scripts) {
      return scripts.concat(plugin.scripts)
    }
    return scripts
  }, [])

  const pluginStyles = plugins.reduce((styles, plugin) => {
    if (plugin.styles) {
      return styles.concat(plugin.styles)
    }
    return styles
  }, [])

  headData.scripts = headData.scripts.concat(pluginScripts)
  headData.styles = headData.styles.concat(pluginStyles)
}

