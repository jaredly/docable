
import {fromJS} from 'immutable'
import React from 'react'
import czz from 'czz'
import config from 'docable$config'

import Browser from './browser'
import Editor from './editor'
import Viewer from './viewer'
import path from 'path'

const {styles} = czz`
app {
  display: flex
  position: fixed
  top: 0
  right: 0
  left: 0
  bottom: 0
}
`

function throttle(fn, minTime, maxTime) {
  let last = null
  let tout = null
  return function () {
    const now = Date.now()
    if (!tout) {
      last = now
      return tout = setTimeout(() => {
        last = null
        tout = null
        fn()
      }, minTime)
    }
    if (now - last + minTime < maxTime) {
      clearTimeout(tout)
      return tout = setTimeout(() => {
        last = null
        tout = null
        fn()
      }, minTime)
    }
  }
}

export default class App extends React.Component {
  constructor() {
    super()
    this.onSlowSave = throttle(this.onSave.bind(this), 1000, 10000)
    this.state = {
      files: null,
      hash: window.location.hash.slice(1),
    }
    this._dirty = false
  }

  componentWillMount() {
    window.addEventListener('hashchange', () => {
      if (this.state.hash !== window.location.hash.slice(1)) {
        this.setState({hash: window.location.hash.slice(1)})
      }
    })
    fetch('/admin/api/data').then(response => {
      response.json().then(files => {
        config.plugins.forEach(plugin => {
          if (!plugin.preprocess) return
          files.forEach(file => plugin.preprocess(config, file))
        })
        this.setState({
          files: toMap(files),
          hash: this.state.hash || files[0].source,
        })
        this._dirty = false
      });
    });
  }

  onSave() {
    const file = this.state.files[this.state.hash]
    const cp = {}
    for (let name in file) {
      if (name === '_renderedBody') continue
      if (name === 'rendered') continue
      if (name === 'rawSource') continue
      if (name === 'body') continue
      if (!name) continue
      cp[name] = file[name]
    }
    fetch('/admin/api/pages', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(cp),
    }).then(response => {
    })
    this._dirty = false
  }

  componentDidUpdate() {
    if (this.state.hash !== window.location.hash.slice(1)) {
      window.location.hash = this.state.hash
    }
  }

  setHash(hash) {
    if (this._dirty) this.onSave()
    this._dirty = false
    this.setState({hash})
  }

  onSelect(name) {
    this.setHash(name)
  }

  navToDest(dest) {
    for (let source in this.state.files) {
      const file = this.state.files[source]
      if (file.dest === dest) {
        return this.setHash(source)
      }
    }
  }

  onBodyChange(value) {
    const files = this.state.files
    files[this.state.hash].rawBody = value
    this.setState({files})
    this._dirty = true
    this.onSlowSave()
  }

  onMetaChange(data) {
    const files = this.state.files
    const file = files[this.state.hash]
    for (let name in data) {
      file[name] = data[name]
    }
    this.setState({files})
    this._dirty = true
    this.onSlowSave()
  }

  onCreateFile(name) {
    const files = this.state.files
    files[name] = {
      type: 'page',
      title: name,
      source: name,
      dest: name.slice(0, -3) + '.html',
      rawBody: 'Hello docable',
    }
    this.setState({files, hash: name})
  }

  render() {
    if (!this.state.files) {
      return <div>Loading...</div>
    }
    const selected = this.state.files[this.state.hash]
    return <div className={styles.app}>
      <Browser
        onSelect={this.onSelect.bind(this)}
        onCreateFile={this.onCreateFile.bind(this)}
        selected={this.state.hash}
        files={this.state.files}/>
      <Editor
        onChangeMeta={this.onMetaChange.bind(this)}
        onChange={this.onBodyChange.bind(this)}
        file={selected}/>
      <Viewer
        navToDest={this.navToDest.bind(this)}
        file={selected}/>
    </div>
  }
}

function toMap(files) {
  return files.reduce((obj, file) => {
    return (obj[file.source] = file, obj);
  }, {});
}

