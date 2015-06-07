
import send from 'send'
import path from 'path'
import fs from 'fs'

export default function getAssets(req, res) {
  const file = escape(req.query.file)
  console.log(file)
  send(req, file).pipe(res);
}


