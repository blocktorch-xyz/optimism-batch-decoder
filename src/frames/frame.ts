import { Batches, parseBatchesData } from '../batches/batch'

type FrameWithCompressedData = {
  channelId: string
  frameNumber: number
  data: string
  isLast: boolean
}

export type FramesWithCompressedData = FrameWithCompressedData[]

export type Frame = Omit<FrameWithCompressedData, 'data'> & {
  batches: Batches
}

export type Frames = Frame[]

const MAX_FRAME_LENGTH = 1_000_000

const BYTE_CHARS = 2
const BYTES_1_LENGTH = 1 * BYTE_CHARS
const BYTES_2_LENGTH = 2 * BYTE_CHARS
const BYTES_4_LENGTH = 4 * BYTE_CHARS
const BYTES_13_LENGTH = 13 * BYTE_CHARS
const BYTES_16_LENGTH = 16 * BYTE_CHARS

export const extractFrames = (data: string): FramesWithCompressedData => {
  const frames: FramesWithCompressedData = []
  let offset = 0
  while (offset < data.length) {
    if (data.length - offset < BYTES_13_LENGTH) {
      // Minimum frame size
      throw new Error('Incomplete frame data')
    }

    const channelId = data.slice(offset, offset + BYTES_16_LENGTH)
    offset += BYTES_16_LENGTH

    const frameNumber = Number(`0x${data.slice(offset, offset + BYTES_2_LENGTH)}`)
    offset += BYTES_2_LENGTH

    const frameDataLengthInBytes = Number(`0x${data.slice(offset, offset + BYTES_4_LENGTH)}`)
    offset += BYTES_4_LENGTH
    const frameDataLength = frameDataLengthInBytes * BYTE_CHARS

    if (frameDataLengthInBytes > MAX_FRAME_LENGTH || offset + frameDataLength > data.length) {
      throw new Error('Frame data length is too large or exceeds buffer length')
    }

    const frameData = `${data.slice(offset, offset + frameDataLength)}`
    offset += frameDataLength

    const isLast = Number(`0x${data.slice(offset, offset + BYTES_1_LENGTH)}`) !== 0
    offset += BYTES_1_LENGTH

    frames.push({ channelId, frameNumber, data: frameData, isLast })
  }

  if (frames.length === 0) {
    throw new Error('Was not able to find any frames')
  }

  return frames
}

export const addBatchesToFrame = async (frame: FrameWithCompressedData): Promise<Frame> => {
  const batches = await parseBatchesData(frame.data)
  return {
    channelId: frame.channelId,
    frameNumber: frame.frameNumber,
    isLast: frame.isLast,
    batches
  }
}
