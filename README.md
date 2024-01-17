
# Optimism batch decoder
Decodes the calldata of a batcher transaction and returns the L2 transactions within it

## Installation
`npm i @blocktorch/optimism-batch-decoder` or `yarn add @blocktorch/optimism-batch-decoder`

## Usage
```
import { decodeBatcherTransactionCalldata } from '@blocktorch/optimism-batch-decoder'

const batcherTransaction = await decodeBatcherTransactionCalldata(calldata)
```

- use `decodeBatcherTransactionCalldata` to decode the provided calldata.
- use `decodeBatcherTransaction` to only provide the transaction hash and provider URL. It will fetch the calldata for you and decode the same way.


- use `testWithExampleData` function to decode example calldata. You can provide the path to example call data, but by default it looks for `example-data/calldata.txt` in the repo.

NB! SpanBatch decoding is unimplemented at the moment.


Made with 💛 at Blocktorch
