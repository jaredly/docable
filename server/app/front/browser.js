
import cx from 'classnames'
import React from 'react'
import czz from 'czz'

const {styles} = czz`
browser {
  width: 300
  background-color: #333
  display: flex
  flex-direction: column
}
list {
  list-style: none;
  margin: 0
  padding: 0
  font-family: monospace
  color: #888
  flex: 1
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

input {
  padding: 5px 10px
  font-size: 16px
  font-family: monospace
}

logo {
  color: lightgreen;
  text-decoration: none;
  padding: 10px 20px;
  text-align: center;
  font-family: sans-serif;
  font-variant: small-caps;
  font-weight: bold;
}
`

export default class Browser extends React.Component {
  render() {
    const names = Object.keys(this.props.files)
    const selected = this.props.selected
    return <div className={styles.browser}>
      <a href="https://jaredly.github.io/docable" target="_blank" className={styles.logo}>docable</a>
      <ul className={styles.list}>
        {names.map(name => <li
            key={name}
            onClick={this.props.onSelect.bind(null, name)}
            className={cx(styles.item, name === selected && styles.selected)}>
          {name}
        </li>)}
      </ul>
      <NewFile onCreate={this.props.onCreateFile}/>
    </div>
  }
}

class NewFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
  }

  onKeyDown(e) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    e.stopPropagation()
    this.props.onCreate(this.state.value)
    this.setState({value: ''})
  }

  render() {
    return <input
      placeholder="new-file.md"
      className={styles.input}
      value={this.state.value}
      onChange={e => this.setState({value: e.target.value})}
      onKeyDown={this.onKeyDown.bind(this)}/>
  }
}

