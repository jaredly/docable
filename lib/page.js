
import React from 'react'

export {theme2head, theme2html}

function theme2head(head, style, asset) {
  const scripts = head.scripts.map(s => `<script src="${asset(s)}"></script>`).join('\n  ')
  const styles = head.styles.map(s => `<link href="${asset(s)}" rel="stylesheet"/>`).join('\n  ')
  return `
  <title>${head.title}</title>
  <style>${style}</style>
  <meta charset="utf8">
  ${scripts}
  ${styles}
`
}

function theme2html(head, body) {
  return `
<!doctype html>
<html>
  <head>
    ${head}
  </head>
  <body>
    ${body}
  </body>
</html>
`
}

