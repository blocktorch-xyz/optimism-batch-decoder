import { NestedUint8Array } from 'rlp'
import { InnerBatch } from './batch'

export class RawSpanBatch {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static decode(data: Uint8Array | NestedUint8Array): InnerBatch {
    // TODO: implement
    // const decoded = rlp.decode(data)
    return {} as InnerBatch
  }
}
