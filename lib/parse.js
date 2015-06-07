
import yaml from 'js-yaml'

const COM_START = '<!--\n---\n'
const COM_END = '\n---\n-->\n'
const REG_START = '---\n'
const REG_END = '\n---\n'

export default function parseData(raw) {
  let meta, text
  raw = raw.trim()
  if (raw.indexOf(COM_START) === 0) {
    const end = raw.indexOf(COM_END)
    meta = raw.slice(COM_START.length, end)
    text = raw.slice(end + COM_END.length)
  } else if (raw.indexOf(REG_START) !== 0) {
    return false
  } else {
    const end = raw.indexOf(REG_END)
    meta = raw.slice(REG_START.length, end)
    text = raw.slice(end + REG_END.length)
  }
  const data = yaml.safeLoad('\n' + meta + '\n')

  data.rawBody = text.trim()
  return data
}

