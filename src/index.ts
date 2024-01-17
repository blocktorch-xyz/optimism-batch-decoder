import { ethers } from 'ethers'
import fs from 'fs'
import path from 'path'
import { BatcherTransaction, extractBatcherTransaction } from './transactions/batcherTransaction'

export const testWithExampleData = async (
  filePath: string = 'example-data/calldata.txt'
): Promise<BatcherTransaction> => {
  const examplePath = path.join(path.dirname(__dirname), filePath)
  const exampleCallData = fs.readFileSync(examplePath).toString()
  return await extractBatcherTransaction(exampleCallData)
}

export const decodeBatcherTransaction = async (txHash: string, providerUrl: string): Promise<BatcherTransaction> => {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl)
  const tx = await provider.getTransaction(txHash)
  if (!tx.data) throw new Error('Transaction is missing calldata')
  return await extractBatcherTransaction(tx.data)
}

export const decodeBatcherTransactionCalldata = async (calldata: string): Promise<BatcherTransaction> => {
  return await extractBatcherTransaction(calldata)
}
