
import React from 'react'
import czz from 'czz'

import Browser from './browser'
import Editor from './editor'
import Viewer from './viewer'

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

export default class App extends React.Component {
  render() {
    return <div className={styles.app}>
      <Browser/>
      <Editor/>
      <Viewer/>
    </div>
  }
}

