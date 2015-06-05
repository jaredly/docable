
import {theme2html, theme2head} from '../../../lib/page'
import path from 'path'

export default config => function iframe(req, res) {
  const themeData = config.theme.page({
    title: 'Demo inline',
  }, config.themeConfig, config.plugins)
  const head = theme2head(themeData.head, '', assetpath => {
    if (assetpath.indexOf('://') !== -1) return assetpath
    return path.join('/admin/theme-assets', 'default', assetpath)
  })

  const html = theme2html(head, '')
  res.send(html)
}

