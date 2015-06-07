
import cx from 'classnames'
import React from 'react'
import czz from 'czz'

const {styles} = czz`
browser {
  width: 300
  background-color: #333
}
list {
  list-style: none;
  margin: 0
  padding: 0
  font-family: monospace
  color: #888
}
item {
  padding: 10px 20px
  cursor: pointer
  transition: background-color .3s ease

  :hover {
    background-color: #eee
  }
}
selected {
  background-color: white
}
`

export default class Browser extends React.Component {
  render() {
    const names = Object.keys(this.props.files)
    const selected = this.props.selected
    return <div className={styles.browser}>
      Browser
      <ul className={styles.list}>
        {names.map(name => <li
            onClick={this.props.onSelect.bind(null, name)}
            className={cx(styles.item, name === selected && styles.selected)}>
          {name}
        </li>)}
      </ul>
    </div>
  }
}

