
import path from 'path'

export default class NavLinks {
  constructor() {
    this.nav = null
    this.paths = []
    this.dir = {}
  }

  preprocess(config, file) {
    if (file.type !== 'page') return
    const parts = file.dest.split('/')
    const name = parts.pop()
    const dir = parts.reduce((obj, part) => {
      if (!obj[part]) obj[part] = {}
      return obj[part]
    }, this.dir)
    dir[name] = {
      title: file.navTitle || file.title,
      index: file.navIndex === undefined ? 1000 : file.navIndex,
      dest: file.dest,
    }
  }

  page(pageData) {
    const parts = pageData.dest.split('/')
    const nav = walkBack(this.dir, parts, path.dirname(pageData.dest))
    return {
      links: nav.children
    }
  }
}

function walkBack(dir, parts, basedir, sub) {
  const obj = {
    children: {},
    open: !!parts,
    href: '/' + dir['index.html'].dest,
  }
  const names = Object.keys(dir)
    .filter(name => {
      if (sub && name === 'index.html') return false
      if (!name.endsWith('.html')) {
        if (!dir[name]['index.html']) {
          console.log('Folder without an index.md', name)
          return false
        }
      }
      return true
    })

  names.sort((a, b) => {
    const aI = dir[a]
    const bI = dir[b]
    const aD = !a.endsWith('.html') ? aI['index.html'].index : aI.index
    const bD = !b.endsWith('.html') ? bI['index.html'].index : bI.index
    return aD - bD
  })

  names.forEach(name => {
    const item = dir[name]
    const subparts = parts && parts[0] === name ? parts.slice(1) : null
    if (!name.endsWith('.html')) {
      obj.children[item['index.html'].title] = walkBack(item, subparts, basedir, true)
      return
    }
    const title = item.title
    if (subparts !== null) {
      obj.children[title] = true
    } else {
      obj.children[title] = '/' + item.dest
    }
  })
  return obj
}

