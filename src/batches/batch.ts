import rlp, { NestedUint8Array } from 'rlp'
import zlib from 'zlib'
import stream from 'stream'
import { SingularBatch } from './SingularBatch'
import { RawSpanBatch } from './RawSpanBatch'

type Transaction = {
  type?: string
  to?: `0x${string}` | null
  gas?: bigint
  data?: `0x${string}`
  nonce?: number
  gasPrice?: bigint
  chainId?: number
  v?: bigint
  s?: `0x${string}`
  r?: `0x${string}`
  hash: `0x${string}`
}

type Transactions = Transaction[]

export type InnerBatch = {
  parentHash: string
  epochNum: number
  epochHash: string
  timestamp: number
  transactions: Transactions
}

type Batch = {
  inner: InnerBatch
}

export type Batches = Batch[]

enum BatchType {
  SingularBatch = 0,
  SpanBatch = 1
}

const MAX_BYTES_PER_CHANNEL = 10_000_000

export const parseBatchesData = async (compressedBatches: string): Promise<Batches> => {
  const decompressed = await decompressBatches(compressedBatches)
  const decodedBatches: Batches = []
  let dataToDecode: Uint8Array = decompressed
  while (dataToDecode?.length) {
    const { data: decoded, remainder } = rlp.decode(dataToDecode, true)
    dataToDecode = remainder
    decodedBatches.push(decodeBatch(decoded))
  }
  return decodedBatches
}

const decompressBatches = async (compressedBatches: string): Promise<Buffer> => {
  const inputBuffer = Buffer.from(compressedBatches, 'hex')
  try {
    // Decompress the input buffer
    const decompress = zlib.createInflate({ maxOutputLength: MAX_BYTES_PER_CHANNEL })
    const decompressStream = stream.Readable.from(inputBuffer)

    const chunks: Buffer[] = []
    for await (const chunk of decompressStream.pipe(decompress)) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  } catch (err) {
    console.error('Error in decompression:', err)
    throw err
  }
}

const decodeBatch = (decodedBatch: Uint8Array | NestedUint8Array): Batch => {
  if (decodedBatch.length < 1) throw new Error('Batch too short')
  // first byte is the batch type
  switch (decodedBatch[0]) {
    case BatchType.SingularBatch:
      return { inner: SingularBatch.decode(decodedBatch.slice(1)) }
    case BatchType.SpanBatch:
      return { inner: RawSpanBatch.decode(decodedBatch.slice(1)) }
    default:
      throw new Error(`Unrecognized batch type: ${decodedBatch[0]}`)
  }
}
