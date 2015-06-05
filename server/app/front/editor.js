
import React from 'react'
import czz from 'czz'

const {styles} = czz`
editor {
  flex: 1
}
`

export default class Editor extends React.Component {
  render() {
    return <div className={styles.editor}>
      Editor
    </div>
  }
}



