
import React from 'react'
import czz from 'czz'
import RCSS from 'rcss'

import {pluginPages} from '../../../lib/cheap-utils'
import render from '../../../lib/render'
import config from 'docable$config'

const CZZ = czz.isolate()

const stylesObj = config.theme.styles(config.themeConfig)
const res = CZZ.groups(stylesObj)
const themeStyles = res.styles
const themeStylesString = CZZ.getString()

const {styles} = czz`
viewer {
  flex: 1
  display: flex
  flex-direction: column
}

iframe {
  border: 1px solid #ccc;
  flex: 1
  margin: 5px;
  background-color: white;
}
`

export default class Viewer extends React.Component {
  constructor(props) {
    super(props)
    this._lastRenderTime = 0
    this._tout = null
  }

  _onLoad() {
    this.doc = React.findDOMNode(this.iframe).contentDocument
    const tag = this.doc.createElement('style')
    tag.innerHTML = themeStylesString
    this.doc.head.appendChild(tag)
    this.doc.body.style.zoom = .5
    this._render()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this._tout) return
    if (this._lastRenderTime < 10) {
      return this._render()
    }
    this._tout = setTimeout(() => {
      this._render()
      this._tout = null
    }, this._lastRenderTime * 3)
  }

  _render() {
    if (!this.props.file) {
      console.log('waiting for data...')
      return
    }
    const start = Date.now()
    const file = this.props.file
    if (file.type !== 'page') {
      let el
      if (file.source.endsWith('.png')) {
        el = <img className={styles.imageAsset}
          src={"/admin/assets?file=" + file.sourcePath}/>
      } else {
        el = <pre>
          {JSON.stringify(file, null, 2)}
        </pre>
      }
      return React.render(el, this.doc.body)
    }

    if (file.rawBody !== file._renderedBody) {
      file.body = render(file.rawBody)
      file._renderedBody = file.rawBody
    }

    const Comp = config.theme.Page
    const plugins = pluginPages(config.plugins, file)
    const el = <Comp
      onClick={e => {
        const node = e.target
        if (node.nodeName !== 'A') {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        const prefix = window.location.origin + '/'
        if (!node.href.startsWith(prefix)) {
          window.open(node.href)
          return
        }
        const dest = node.href.slice(prefix.length)
        this.props.navToDest(dest)
      }}
      file={file}
      plugins={plugins}
      styles={themeStyles}/>

    React.render(el, this.doc.body)
    this._lastRenderTime = Date.now() - start
  }

  render() {
    return <div className={styles.viewer}>
      <iframe
        className={styles.iframe}
        onLoad={this._onLoad.bind(this)}
        ref={i => this.iframe = i}
        src="/admin/iframe"/>
    </div>
  }
}

