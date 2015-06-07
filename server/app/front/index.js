
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

function minAwesome(fn, minTime, maxTime) {
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
    this.onSlowSave = minAwesome(this.onSave.bind(this), 1000, 10000)
    this.state = {
      files: null,
      path: window.location.hash.slice(1),
    }
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
          hash: files[0].source,
        })
      });
    });
  }

  onSave() {
    const file = this.state.files[this.state.hash]
    const cp = {}
    for (let name in file) {
      if (name === '_renderedBody') continue
      if (name === 'rendered') continue
      cp[name] = file
    }
    fetch('/admin/api/pages', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(cp),
    }).then(response => {
    })
  }

  componentDidUpdate() {
    if (this.state.hash !== window.location.hash.slice(1)) {
      window.location.hash = this.state.hash
    }
  }

  setHash(hash) {
    this.onSave()
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
    this.onSlowSave()
  }

  render() {
    if (!this.state.files) {
      return <div>Loading...</div>
    }
    const selected = this.state.files[this.state.hash]
    return <div className={styles.app}>
      <Browser
        onSelect={this.onSelect.bind(this)}
        selected={this.state.hash}
        files={this.state.files}/>
      <Editor
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

