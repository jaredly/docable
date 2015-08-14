
import React from 'react'
import czz from 'czz'
import RCSS from 'rcss'

import {pluginPages} from '../../../lib/cheap-utils'
import render from 'mark-that'
import config from 'docable$config'

const CZZ = czz.isolate()

const stylesObj = config.theme.styles(config.themeConfig)
const res = CZZ.groups(stylesObj)
const themeStyles = res.styles
const themeStylesString = CZZ.getString()
const renderer = render(config, true)

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

function scroller(el) {
  let goal = 0
  let _int
  return function (pos) {
    if (pos === false) {
      return clearInterval(_int)
    }
    goal = pos
    if (_int) return
    _int = setInterval(() => {
      const pre = el.scrollTop
      const diff = (goal - el.scrollTop)
      el.scrollTop += diff / 10
      if (pre === el.scrollTop || Math.abs(goal - el.scrollTop) < 1) {
        el.scrollTop = goal
        clearInterval(_int)
        _int = null
      }
    }, 16);
    return _int;
  }
}

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
    this.doc.body.onmousewheel = evt => {
      clearInterval(this._scrolling);
      const lines = this.doc.body.querySelectorAll('[data-line]')
      for (let i=0; i<lines.length; i++) {
        const top = lines[i].getBoundingClientRect().top
        if (top > 0) {
          this.props.onScroll(+lines[i].getAttribute('data-line'))
          return
        }
      }
    }
    this.scroller = scroller(this.doc.body)
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

  scrollNearLine(line) {
    if (line === false) {
      this.scroller(this.doc.body.scrollHeight)
      return
    }

    if (line === 0) {
      this.scroller(0)
      return
    }
    this.scroller(this.getLinePos(line) / 2)
  }

  getLinePos(line) {
    var before = null, after = null, amount = null
    for (let i=0; i<this._lines.length; i++) {
      if (this._lines[i] === line) {
        before = line
        amount = 0
        break;
      }
      if (this._lines[i] > line) {
        if (i === 0) {
          before = this._lines[i]
          amount = 0
        } else {
          after = this._lines[i]
          before = this._lines[i-1]
          amount = (line - before) / (after - before)
        }
        break;
      }
    }
    if (before === null) {
      return this.doc.body.scrollHeight
    }
    const relTop = this.doc.body.getBoundingClientRect().top
    const node1 = this.doc.querySelector('[data-line="' + before + '"]')
    const n1top = node1.getBoundingClientRect().top - relTop
    return n1top;
    // TODO maybe revisit?
    if (!after) {
      return n1top
    }
    const node2 = this.doc.querySelector('[data-line="' + after + '"]')
    const n2top = node2.getBoundingClientRect().top - relTop
    return (n2top - n1top) * amount + n1top
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
      let lines
      [file.body, lines] = renderer(file.rawBody)
      this._lines = lines
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
    const href = this.props.file && this.props.file.dest
    return <div className={styles.viewer}>
      <iframe
        className={styles.iframe}
        onLoad={this._onLoad.bind(this)}
        ref={i => this.iframe = i}
        src="/admin/iframe"/>
      <a href={'/' + href} target="_blank" className={styles.fullView}>full view</a>
    </div>
  }
}

