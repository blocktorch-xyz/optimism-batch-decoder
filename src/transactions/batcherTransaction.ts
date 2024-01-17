import { Frames, extractFrames, addBatchesToFrame } from '../frames/frame'

export type BatcherTransaction = {
  version: number
  frames: Frames
}

const DERIVATION_VERSION_0 = 0

export const extractBatcherTransaction = async (calldata: string): Promise<BatcherTransaction> => {
  if (calldata.length === 0) {
    throw new Error('data array must not be empty')
  }

  const version = Number(calldata.slice(0, 4))
  if (version !== DERIVATION_VERSION_0) {
    throw new Error(`invalid derivation format byte: got ${version}`)
  }

  // Skip the derivation version byte and 0x at the start
  const rawFrames = extractFrames(calldata.slice(4))
  const frames: Frames = []
  for (const rawFrame of rawFrames) {
    const frame = await addBatchesToFrame(rawFrame)
    frames.push(frame)
  }
  return { version, frames }
}
