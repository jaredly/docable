
import React from 'react'
import czz from 'czz'
import RCSS from 'rcss'

import {fluxify} from 'flammable/react'

import {pluginPages} from '../../../lib/cheap-utils'

import config from 'docable$config'

const CZZ = czz.isolate()

const stylesObj = config.theme.styles(config.themeConfig)
const res = CZZ.groups(stylesObj)
const themeStyles = res.styles
const themeStylesString = CZZ.getString()

const {styles} = czz`
viewer {
  flex: 1
  background-color: #eef
  display: flex
  flex-direction: column
}

iframe {
  border: 1px solid #ccc;
  flex: 1
  margin: 10px;
}
`

@fluxify({
  data: {
          /*
    doc: {
      curpath: 'curpath',
      pageData: 'pageData',
    }
    */
  },
})
export default class Viewer extends React.Component {
  _onLoad() {
    const doc = React.findDOMNode(this.iframe).contentDocument
    const tag = doc.createElement('style')
    tag.innerHTML = themeStylesString
    doc.head.appendChild(tag)
    this._render()
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps, prevState) {
    this._render()
  }

  _render() {
    if (!this.props.pageData || !this.props.curpath) {
      console.log('waiting for data...')
      return
    }
    const Comp = config.theme.Page
    const plugins = pluginPages(
      config.plugins,
      this.props.pageData,
      this.props.curpath
    )
    const el = <Comp
      pageData={this.props.pageData}
      plugins={plugins}
      styles={themeStyles}/>
    const themeData = config.theme.page
  }

  render() {
    return <div className={styles.viewer}>
      Viewer
      <iframe
        className={styles.iframe}
        onLoad={this._onLoad.bind(this)}
        ref={i => this.iframe = i}
        src="/admin/iframe"/>
    </div>
  }
}



