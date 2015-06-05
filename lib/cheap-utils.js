
export {pluginPages}

function pluginPages(plugins, pageData, curpath) {
  return plugins.reduce((plugins, plugin) => {
    if ('function' === typeof plugin) {
      plugins.push(plugin(pageData, curpath))
      return plugins
    }
    if (!plugin.page) return plugins
    plugins.push(plugin.page(pageData, curpath))
    return plugins
  }, [])
}

