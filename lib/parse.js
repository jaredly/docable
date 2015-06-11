
import yaml from 'js-yaml'

export default function parseData(raw) {
  let found = findMeta(raw.trim())
  if (!found) return {rawBody: raw.trim()}
  const {body, meta} = found
  const data = yaml.safeLoad('\n' + meta + '\n')
  data.rawBody = body.trim()
  return data
}

const FENCES = {
  comment: ['<!-- @frontmatter\n', '\n-->\n'],
  normal: ['---\n', '\n---\n'],
}

function findMeta(raw) {
  for (let i in FENCES) {
    const start = raw.indexOf(FENCES[i][0])
    if (start !== 0) continue;
    const end = raw.indexOf(FENCES[i][1])
    if (end === -1) continue;
    const meta = raw.slice(FENCES[i][0].length, end).trim()
    const body = raw.slice(end + FENCES[i][1].length)
    return {meta, body}
  }
}

