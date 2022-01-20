# Tezos Swap Router SDK

Library that helps you ti find most profitable way to swap tokens on Tezos ecosystem.  

Supported DEXes:
 - QuipuSwap
 - Plenty
 - Liquidity Baking

## Installation

```bash
yarn add swap-router-sdk
```

## Prerequisites & explenation

`TEZOS_DEXES_API_URL: string` - url to the WebSocket server that returns list of available pairs and their liquidity  
`inputAssetSlug: string` - slug (`address_id` || `tez`) of input token  
`outputAssetSlug: string` - slug (`address_id` || `tez`) of desired output token  
`inputMutezAmount: BigNumber` - number of input token (`1 TEZ` = `1 000 000 mutez`)  
`outputMutezAmount: BigNumber` - number of output token (`1 TEZ` = `1 000 000 mutez`)  
`slippageTolerance: number | undefined` - slippage tolerance percent

## Usage

```TypeScript
const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);

const routePairsCombinations = useRoutePairsCombinations(
  inputAssetSlug,
  outputAssetSlug,
  allRoutePairs.data
);

...

const bestTradeExactIn = getBestTradeExactInput(inputMutezAmount, routePairsCombinations);
const bestTradeExactOutput = getBestTradeExactOutput(outputMutezAmount, routePairsCombinations);

...

const bestTradeWithSlippageTolerance = useTradeWithSlippageTolerance(
  inputMutezAmount,
  bestTrade,
  slippageTolerance
);

...

const tradeTransferParams = await getTradeOpParams(bestTradeWithSlippageTolerance, account.publicKeyHash, tezos);

const walletParamsWithKind = tradeTransferParams.map(transferParams => parseTransferParamsToParamsWithKind(transferParams));
```
