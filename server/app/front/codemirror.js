
import React from 'react'

export default class CodeMirrorText extends React.Component {

  componentDidMount() {
    this._cm = new CodeMirror(React.findDOMNode(this), this.props)
    this._cm.on('change', doc => this.props.onChange(doc.getValue()))
    this._cm.on('scroll', inst => {
      if (this._scrolling) {
        return this._scrolling = false
      }
      const info = this._cm.getScrollInfo()
      if (info.clientHeight + info.top === info.height) {
        return this.props.onScroll(false)
      }
      const topLine = this._cm.lineAtHeight(info.top + 10, 'local')
      this.props.onScroll(topLine)
    })
    var node = this._cm.getWrapperElement()
    node.style.height = '700px'
    node.style.flex = 1
    if (this.props.style) {
      reactStyle(node, this.props.style)
      this._cm.refresh()
    }
    setTimeout(() => this._cm.refresh(), 1000)
  }

  componentDidUpdate(prevProps) {
    var same = true
    for (var name in this.props) {
      if (this.props[name] !== prevProps[name]) {
        if (name === 'value' && this._cm.getValue() === this.props[name]) continue
        this._cm.setOption(name, this.props[name] || '')
      }
    }
  }

  scrollIntoView(line) {
    this._scrolling = true
    this._cm.scrollTo(0, this._cm.heightAtLine(line, 'local'))
  }

  render() {
    return <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      fontSize: 16,
    }}/>
  }
}
