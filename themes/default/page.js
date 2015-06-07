
import React from 'react'
import Header from './header'

const PT = React.PropTypes

export default class Page extends React.Component {
  constructor(props) {
    super(props)
  }

  static childContextTypes = {
    styles: PT.object,
    plugins: PT.array,
  }

  getChildContext() {
    return {
      styles: this.props.styles,
      plugins: this.props.plugins,
    }
  }

  render() {
    const {
      title, subtitle, cdn, body, fontFamily,
      colors, sourceLink
    } = this.props.file
    const styles = this.props.styles
    const plugins = this.props.plugins

    const links = {}
    for (let name in this.props.file.links) {
      links[name] = this.props.file.links[name]
    }
    plugins.forEach(plugin => {
      if (!plugin.links) return
      for (let name in plugin.links) {
        links[name] = plugin.links[name]
      }
    })

    const block = name => {
      return plugins.reduce((blocks, plugin) => {
        if (!plugin.blocks || !plugin.blocks[name]) return blocks
        return blocks.concat(plugin.blocks[name](styles))
      }, [])
    }

    const children = makeBodyChildren({
      header: <Header title={title}
        styles={styles}
        subtitle={subtitle}
        links={links}
        fontFamily={fontFamily}
        key='header'
        colors={colors}/>,
      content: <Content key='content' styles={styles} text={body}/>,
      footer: <Footer
        key='footer'
        styles={styles}
        block={block}
        sourceLink={sourceLink}/>
    }, plugins)

    return <div onClick={this.props.onClick} className={this.props.styles.page}>
      {children}
    </div>
  }
}

function makeBodyChildren(base, plugins) {
  let children = []
  for (let name in base) {
    const cap = name[0].toUpperCase() + name.slice(1)
    plugins.forEach(plugin => {
      if (!plugin.blocks) return
      if (plugin.blocks['before' + cap]) {
        children = children.concat(plugin.blocks['before' + cap]())
      }
    })
    children.push(base[name])
    plugins.forEach(plugin => {
      if (!plugin.blocks) return
      if (plugin.blocks['after' + cap]) {
        children = children.concat(plugin.blocks['after' + cap]())
      }
    })
  }
  return children
}

class Footer extends React.Component {
  render() {
    const styles = this.props.styles
    return <div className={styles.footer.container}>
      <p className={styles.utils.noMargin}>page rendered with <a href="https://jaredly.github.io/demobox">demobox</a></p>
      {this.props.block('footer')}
    </div>
  }
}

class Content extends React.Component {
  render() {
    return <div className={'markdown-content ' + this.props.styles.content.container}
      dangerouslySetInnerHTML={{__html: this.props.text}}/>
  }
}

export {Page}

