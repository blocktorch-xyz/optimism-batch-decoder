type Frame = {
  channelId: string;
  frameNumber: number;
  data: string;
  isLast: boolean;
};

const DERIVATION_VERSION_0 = 0;
const MAX_FRAME_LENGTH = 1_000_000;

const BYTE_CHARS = 2
const BYTES_1_LENGTH = 1 * BYTE_CHARS
const BYTES_2_LENGTH = 2 * BYTE_CHARS
const BYTES_4_LENGTH = 4 * BYTE_CHARS
const BYTES_13_LENGTH = 13 * BYTE_CHARS
const BYTES_16_LENGTH = 16 * BYTE_CHARS

export const parseToFrames = (calldata: string): Frame[] => {
  if (calldata.length === 0) {
    throw new Error("data array must not be empty");
  }

  const version = calldata.slice(0, 4)
  if (Number(version) !== DERIVATION_VERSION_0) {
    throw new Error(`invalid derivation format byte: got ${version}`);
  }

  let offset = 4; // Skip the derivation version byte and 0x at the start
  const frames: Frame[] = [];

  while (offset < calldata.length) {
    if (calldata.length - offset < BYTES_13_LENGTH) { // Minimum frame size
      throw new Error("Incomplete frame data");
    }

    const channelId = calldata.slice(offset, offset + BYTES_16_LENGTH)
    offset += BYTES_16_LENGTH;

    const frameNumber = Number(`0x${calldata.slice(offset, offset + BYTES_2_LENGTH)}`)
    offset += BYTES_2_LENGTH;

    const frameDataLengthInBytes = Number(`0x${calldata.slice(offset, offset + BYTES_4_LENGTH)}`)
    offset += BYTES_4_LENGTH;
    const frameDataLength = frameDataLengthInBytes * BYTE_CHARS


    if (frameDataLengthInBytes > MAX_FRAME_LENGTH || offset + frameDataLength > calldata.length) {
      throw new Error("Frame data length is too large or exceeds buffer length");
    }

    const frameData = `${calldata.slice(offset, offset + frameDataLength)}`;
    offset += frameDataLength;

    const isLast = Number(`0x${calldata.slice(offset, offset + BYTES_1_LENGTH)}`) !== 0
    offset += BYTES_1_LENGTH;

    frames.push({ channelId, frameNumber, data: frameData, isLast });
  }

  if (frames.length === 0) {
    throw new Error("Was not able to find any frames");
  }

  return frames;
}
