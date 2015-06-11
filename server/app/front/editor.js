
import React from 'react'
import czz from 'czz'
import {Form} from 'formative'

const {styles} = czz`
editor {
  flex: 1
  flex-direction: column
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

metadata {
  flex-direction: column
  display: flex
}

title {
  outline: none
  font-size: 20px
  padding: 3px 5px
}

subtitle {
  outline: none
  font-size: 16px
  padding: 3px 5px
}
`

export default class Editor extends React.Component {
  render() {
    return <div className={styles.editor}>
      {this.props.file.type === 'page' && <MetaData
        key={this.props.file.source}
        onChange={data => this.props.onChangeMeta(data)}
        data={this.props.file}/>}
      <textarea className={styles.text}
        onChange={e => this.props.onChange(e.target.value)} value={this.props.file.rawBody}/>
    </div>
  }
}

class MetaData extends React.Component {
  _onSubmit(data, e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (data.navIndex) data.navIndex = parseInt(data.navIndex)
    this.props.onChange(data)
  }
  render() {
    return <Form
      onChange={this._onSubmit.bind(this)}
      onSubmit={this._onSubmit.bind(this)}
      className={styles.metadata} initialData={{
        title: this.props.data.title,
        subtitle: this.props.data.subtitle,
        navIndex: this.props.data.navIndex,
        navTitle: this.props.data.navTitle,
      }}>
      <input className={styles.title} type="text" name="title" placeholder="Title"/>
      <input className={styles.subtitle} type="text" name="subtitle" placeholder="Subtitle"/>
      <input name="navIndex" type='number' placeholder="Nav index (number)"/>
      <input name="navTitle" placeholder="Nav title"/>
    </Form>
  }
}

