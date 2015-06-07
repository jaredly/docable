
import fontPairs from './font-pairs'

export default function head(pageData, themeConfig) {

  const fonts = themeConfig.fontPair ? fontPairs[themeConfig.fontPair] : themeConfig.fonts

  return {
    title: pageData.title,
    scripts: [
      // "codemirror/codemirror.min.js",
      // "codemirror/mode/javascript/javascript.min.js",
      // "react.js",
      // "demobox.js",
    ],
    styles: [
      // "codemirror/codemirror.min.css",
      // "highlight.js/styles/default.min.css",
      "./css/markdown.css",
      "./css/demobox.css",
      "./css/theme.css",
      // 'https://fonts.googleapis.com/css?family=Open+Sans:800',
      // 'https://fonts.googleapis.com/css?family=Gentium+Basic',
    ].concat(fontUrls(fonts)),
  }
}

function fontUrls(fonts) {
  const urls = []
  const gfonts = []
  for (let name in fonts) {
    if (fonts[name].gfont) {
      gfonts.push(fonts[name].gfont)
    } else if (fonts[name].url) {
      urls.push(fonts[name].url)
    }
  }
  if (gfonts.length) {
    urls.push('https://fonts.googleapis.com/css?family=' + gfonts.join('|'))
  }
  return urls
}

