import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { PermissionsOpParams } from '../interface/permissions-op-params.interface';
import { TradeOperation } from '../interface/trade.interface';
import { TokenStandardEnum } from '../enum/token-standard.enum';
import { loadAssetContract } from './asset.utils';

export const getPermissionsTransferParams = async (
  tradeOperation: TradeOperation,
  senderPublicKeyHash: string,
  tezos: TezosToolkit
): Promise<PermissionsOpParams> => {
  if (tradeOperation.aTokenSlug === 'tez') {
    return { approve: [], revoke: [] };
  }

  const assetContract = await loadAssetContract(tradeOperation.aTokenSlug, tezos);

  if (assetContract) {
    if (assetContract.standard === TokenStandardEnum.FA1_2) {
      return {
        approve: [
          assetContract.contract.methods
            .approve(tradeOperation.dexAddress, new BigNumber(0))
            .toTransferParams({ mutez: true }),
          assetContract.contract.methods
            .approve(tradeOperation.dexAddress, tradeOperation.aTokenAmount)
            .toTransferParams({ mutez: true })
        ],
        revoke: []
      };
    }

    if (assetContract.standard === TokenStandardEnum.FA2) {
      return {
        approve: [
          assetContract.contract.methods
            .update_operators([
              {
                add_operator: {
                  owner: senderPublicKeyHash,
                  operator: tradeOperation.dexAddress,
                  token_id: assetContract.assetId
                }
              }
            ])
            .toTransferParams({ mutez: true })
        ],
        revoke: [
          assetContract.contract.methods
            .update_operators([
              {
                remove_operator: {
                  owner: senderPublicKeyHash,
                  operator: tradeOperation.dexAddress,
                  token_id: assetContract.assetId
                }
              }
            ])
            .toTransferParams({ mutez: true })
        ]
      };
    }
  }

  return { approve: [], revoke: [] };
};
