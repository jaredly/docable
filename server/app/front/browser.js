
import React from 'react'
import czz from 'czz'

const {styles} = czz`
browser {
  width: 300
}
`

export default class Browser extends React.Component {
  render() {
    return <div className={styles.browser}>
      Browser
    </div>
  }
}

