
import React from 'react'
import czz from 'czz'

const {styles} = czz`
editor {
  flex: 1
  display: flex
}

text {
  flex: 1
  font-family: monospace
  font-size: 16px
  border: none
  outline: none
  padding: 20px
}
`

export default class Editor extends React.Component {
  render() {
    return <div className={styles.editor}>
      <textarea className={styles.text}
        onChange={e => this.props.onChange(e.target.value)} value={this.props.file.rawBody}/>
    </div>
  }
}

