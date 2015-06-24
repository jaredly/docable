
import React from 'react'
import cx from 'classnames'

export default class Header extends React.Component {
  render() {
    const styles = this.props.styles.header
    const links = makeLinkList(this.props.links)
    return <header className={styles.container}>
      <div className={styles.title}>{this.props.title}</div>
      <div className={styles.subTitle}>{this.props.subtitle}</div>
      <Nav styles={styles} links={links}/>
    </header>
  }
}

class Nav extends React.Component {
  render() {
    const styles = this.props.styles
    const links = this.props.links
    const main = <ul className={styles.links}>
      {links.main.map(link => link && <li key={link.href} className={styles.linkItem}>
        <a className={cx(
          styles.link,
          link.active && styles.linkActive,
          !link.href && styles.linkCurrent,
          link.external && styles.linkExternal,
        )} target={link.external ? '_blank' : undefined} href={link.href} title={link.title}>{link.text}</a>
      </li>)}
    </ul>
    if (!links.second) return main
    return <div>
      {main}
      <Nav links={links.second}
        styles={styles}/>
    </div>
  }
}

/**
 * {
 *  name: href | true | {href: str, open: bool, children: {}} | {href: str, active: bool}
 * }
 */
function makeLinkList(links) {
  if (!links) return []
  let second = null
  const main = Object.keys(links).map(name => {
    let link = links[name]
    if (link.children) {
      if (link.open) {
        second = makeLinkList(link.children)
      }
      link = {
        href: link.href,
        active: link.open,
      }
    }

    if ('string' === typeof link) {
      link = {
        href: link
      }
    }
    if (link === true) return {
      text: name,
      active: true,
    }
    link.text = name
    if (link.href && link.href.indexOf('://') !== -1) {
      link.external = true
    }
    return link
  })
  return {main, second}
}

