
# Optimism batch decoder
Decodes the calldata of a batcher transaction and returns the L2 transactions within it

## Usage
- install the repo
- use `testWithExampleData` function to decode example calldata. You can edit `example-data/calldata.txt` to test different calldata
- use `decodeBatcherTransaction` to only provide the transaction hash and provider URL. It will fetch the calldata for you and decode the same way.
- use `decodeBatcherTransactionCalldata` to decode the provided calldata.

NB! SpanBatch decoding is unimplemented at the moment.


Made with 💛 at Blocktorch
