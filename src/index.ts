import fs from 'fs'
import path from 'path'
import { BatcherTransaction, extractBatcherTransaction } from './transactions/batcherTransaction'
import { ethers } from 'ethers'

export const testWithExampleData = async (): Promise<BatcherTransaction> => {
  const examplePath = path.join(path.dirname(__dirname), 'example-data/calldata.txt')
  const exampleCallData = fs.readFileSync(examplePath).toString()
  return await extractBatcherTransaction(exampleCallData)
}

export const decodeBatcherTransaction = async (txHash: string, providerUrl: string): Promise<BatcherTransaction> => {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl)
  const tx = await provider.getTransaction(txHash)
  if (!tx.data) throw new Error('Transaction is missing calldata')
  return await extractBatcherTransaction(tx.data)
}
