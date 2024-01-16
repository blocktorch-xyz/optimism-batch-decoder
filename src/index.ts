import fs from 'fs'
import path from 'path'
import { extractBatcherTransaction } from './transactions/batcherTransaction'


(async () => {
  const examplePath = path.join(path.dirname(__dirname), 'example-data/calldata.txt')
  const exampleCallData = fs.readFileSync(examplePath).toString()
  return await extractBatcherTransaction(exampleCallData)
})()
