
# Optimism batch decoder
Decodes the calldata of a batcher transaction and returns the L2 transactions within it

## Background
The transactions of a L2 rollup are batched together and submitted to a L1. The Batcher will submit these batches to a Batch Inbox Address on L1, which is an EOA and will save gas because no code will be executed.
`0xFF00000000000000000000000000000000000010` is the Batch Inbox Address of Optimism on Ethereum.
The calldata of each transaction to the Batch Inbox contains batches of L2 as an encoded and compressed hex string.

## Installation
`npm i @blocktorch/optimism-batch-decoder` or `yarn add @blocktorch/optimism-batch-decoder`

## Usage
### `decodeBatcherTransactionCalldata(calldata)`
Decodes the L2 transactions from raw calldata
- `calldata` - the calldata of the transaction by a Batcher to the Batch Inbox Address on L1.
  You can get it from the transaction page on Etherscan (Input Data -> View Input As Original). For an example, check `example-data/calldata.txt`.

```javascript
import { decodeBatcherTransactionCalldata } from '@blocktorch/optimism-batch-decoder'

const batcherTransaction = await decodeBatcherTransactionCalldata(calldata)
```

### `decodeBatcherTransaction(txHash, providerUrl)`
Wrapper for `decodeBatcherTransactionCalldata`. Will fetch the calldata for you based on the transaction hash.
- `txHash` - hash of the L1 transaction to the Batch Inbox
- `providerUrl` - RPC provider URL that is used to fetch data about the transaction


### `testWithExampleData(path?)`
Test function to decode example calldata. You can provide the path to example call data, but by default it looks for `example-data/calldata.txt` in the repository.
- `path` - path to your own calldata relative to the repository root.

### `BatcherTransaction`
All of the functions will return a BatcherTransaction.
It contains a version and its Frames. [More about the batcher transaction format](https://github.com/ethereum-optimism/optimism/blob/v1.1.4/specs/derivation.md#batcher-transaction-format)

Each Frame contains [info about the Frame](https://github.com/ethereum-optimism/optimism/blob/v1.1.4/specs/derivation.md#frame-format) and its batches.

And each Batch contains a list of transactions and [info about the Batch](https://github.com/ethereum-optimism/optimism/blob/v1.1.4/specs/derivation.md#batch-format)


## Known issues
NB! SpanBatch decoding is unimplemented at the moment.

---

Made with 💛 at Blocktorch
