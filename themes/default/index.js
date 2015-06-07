
import fontPairs from './font-pairs'
import colorSwatches from './color-swatches'

import head from './head'
import Page from './page'
import styles from './styles'

module.exports = {
  name: 'default',
  head,
  styles,
  defaultConfig: {
    fonts: fontPairs['Open Sans'],
    colors: colorSwatches['Red'],
  },
  basedir: __dirname,
  assets: [
    'css/markdown.css',
    'css/demobox.css',
    'css/theme.css',
  ],
  Page,
}

