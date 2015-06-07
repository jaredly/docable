
import {theme2html, theme2head} from '../../../lib/page'
import path from 'path'

export default config => function iframe(req, res) {
  const headData = config.theme.head({
    title: 'Demo inline',
  }, config.themeConfig)

  const head = theme2head(headData, '', assetpath => {
    if (assetpath.indexOf('://') !== -1) return assetpath
    return path.join('/admin/theme-assets', 'default', assetpath)
  })

  const html = theme2html(head, '')
  res.send(html)
}

