import fs from 'fs'
import path from 'path'



(async () => {
  const examplePath = path.join(path.dirname(__dirname), 'example-data/calldata.txt')
  const exampleCallData = fs.readFileSync(examplePath).toString()
})()
