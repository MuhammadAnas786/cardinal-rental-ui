import type { AccountData } from '@cardinal/common'
import {
  findMintEditionId,
  findMintMetadataId,
  getBatchedMultipleAccounts,
  tryPublicKey,
} from '@cardinal/common'
import { tokenManager } from '@cardinal/token-manager/dist/cjs/programs'
import type { PaidClaimApproverData } from '@cardinal/token-manager/dist/cjs/programs/claimApprover'
import type { TimeInvalidatorData } from '@cardinal/token-manager/dist/cjs/programs/timeInvalidator'
import { TIME_INVALIDATOR_ADDRESS } from '@cardinal/token-manager/dist/cjs/programs/timeInvalidator'
import { findTimeInvalidatorAddress } from '@cardinal/token-manager/dist/cjs/programs/timeInvalidator/pda'
import type { TokenManagerData } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import { findTokenManagerAddress } from '@cardinal/token-manager/dist/cjs/programs/tokenManager/pda'
import type { UseInvalidatorData } from '@cardinal/token-manager/dist/cjs/programs/useInvalidator'
import { USE_INVALIDATOR_ADDRESS } from '@cardinal/token-manager/dist/cjs/programs/useInvalidator'
import { findUseInvalidatorAddress } from '@cardinal/token-manager/dist/cjs/programs/useInvalidator/pda'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import * as anchor from '@project-serum/anchor'
import type * as spl from '@solana/spl-token'
import { getAccount } from '@solana/spl-token'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { TokenFilter } from 'config/config'
import type { IndexedData } from 'hooks/useBrowseAvailableTokenDatas'
import type { ParsedTokenAccountData } from 'hooks/useTokenAccounts'
import type { SingleTokenData } from 'hooks/useTokenData'
import { fetchAccountDataById } from 'providers/SolanaAccountsProvider'

export interface TokenData {
  tokenAccount?: AccountData<ParsedTokenAccountData>
  mint?: AccountData<spl.Mint> | null
  indexedData?: IndexedData
  tokenManager?: AccountData<TokenManagerData>
  metaplexData?: AccountData<metaplex.Metadata>
  metadata?: AccountData<{
    image?: string
    attributes?: { trait_type: string; value: string }[]
  }> | null
  editionData?: AccountData<metaplex.Edition | metaplex.MasterEditionV2>
  claimApprover?: AccountData<PaidClaimApproverData> | null
  useInvalidator?: AccountData<UseInvalidatorData> | null
  timeInvalidator?: AccountData<TimeInvalidatorData> | null
  recipientTokenAccount?: AccountData<spl.Account>
}

/** Converts serialized tokenData or similar to TokenData */
export const convertStringsToPubkeys: any = (obj: any) => {
  if (!obj) return obj
  if (typeof obj === 'string') {
    try {
      return new anchor.BN(obj, 16)
    } catch {
      return tryPublicKey(obj) ?? obj
    }
  }
  if (obj instanceof Array) {
    return obj.map((v) => convertStringsToPubkeys(v))
  }
  if (typeof obj === 'object') {
    const convertedObject: { [key: string]: any } = {}
    Object.entries(obj).forEach(([k, v]) => {
      convertedObject[k] = convertStringsToPubkeys(v)
    })
    return convertedObject
  }
  return obj
}

export async function getTokenDatas(
  connection: Connection,
  tokenManagerDatas: AccountData<TokenManagerData>[],
  filter?: TokenFilter,
  cluster?: string
): Promise<TokenData[]> {
  tokenManagerDatas = tokenManagerDatas.filter((tm) => tm.parsed)
  if (filter?.type === 'issuer') {
    tokenManagerDatas = tokenManagerDatas.filter((tm) =>
      filter.value.includes(tm.parsed.issuer.toString())
    )
  }

  const metaplexIds = tokenManagerDatas.map((tm) =>
    findMintMetadataId(tm.parsed.mint)
  )
  const metaplexAccountInfos = await getBatchedMultipleAccounts(
    connection,
    metaplexIds
  )
  const metaplexDataById = metaplexAccountInfos.reduce(
    (acc, accountInfo, i) => {
      try {
        if (accountInfo?.data) {
          acc[tokenManagerDatas[i]!.pubkey.toString()] = {
            pubkey: metaplexIds[i]!,
            ...accountInfo,
            parsed: metaplex.Metadata.deserialize(accountInfo?.data)[0],
          }
        }
      } catch (e) {}
      return acc
    },
    {} as {
      [tokenManagerId: string]: {
        pubkey: PublicKey
        parsed: metaplex.Metadata
      }
    }
  )

  if (filter?.type === 'creators') {
    tokenManagerDatas = tokenManagerDatas.filter((tm) =>
      metaplexDataById[tm.pubkey.toString()]?.parsed?.data?.creators?.some(
        (creator) =>
          filter.value.includes(creator.address.toString()) &&
          (cluster === 'devnet' || creator.verified || filter.nonVerified)
      )
    )
  }

  // filter by known invalidators
  const knownTokenManagers = []
  for (const tm of tokenManagerDatas) {
    const [timeInvalidatorId, useInvalidatorId] = [
      findTimeInvalidatorAddress(tm.pubkey),
      findUseInvalidatorAddress(tm.pubkey),
    ]
    const knownInvalidators = [
      timeInvalidatorId.toString(),
      useInvalidatorId.toString(),
      tm.parsed.issuer.toString(),
    ]
    let filter = false
    tm.parsed.invalidators.forEach((i) => {
      if (!knownInvalidators.includes(i.toString())) {
        filter = true
      }
    })
    if (!filter) {
      knownTokenManagers.push(tm)
    }
  }
  tokenManagerDatas = knownTokenManagers

  const mintIds = tokenManagerDatas.map(
    (tokenManager) => tokenManager.parsed.mint
  )
  const editionIds = tokenManagerDatas.map((tm) =>
    findMintEditionId(tm.parsed.mint)
  )
  const idsToFetch = tokenManagerDatas.reduce(
    (acc, tm) => [
      ...acc,
      tm.parsed.claimApprover,
      ...tm.parsed.invalidators,
      tm.parsed.recipientTokenAccount,
    ],
    [...editionIds, ...mintIds] as (PublicKey | null)[]
  )
  const [accountsById, metadatas] = await Promise.all([
    fetchAccountDataById(connection, idsToFetch),
    Promise.all(
      tokenManagerDatas.map(async (tm) => {
        try {
          const metaplexDataForTokenManager =
            metaplexDataById[tm.pubkey.toString()]
          if (!metaplexDataForTokenManager?.parsed.data.uri) return null
          const json = await fetch(
            metaplexDataForTokenManager.parsed.data.uri
          ).then((r) => r.json())
          return {
            pubkey: metaplexDataForTokenManager.pubkey,
            parsed: json,
          }
        } catch (e) {}
      })
    ),
  ])

  const metadataById = metadatas.reduce(
    (acc, md, i) => ({ ...acc, [tokenManagerDatas[i]!.pubkey.toString()]: md }),
    {} as {
      [tokenManagerId: string]:
        | { pubkey: PublicKey; parsed: any }
        | undefined
        | null
    }
  )

  return tokenManagerDatas.map((tokenManagerData, i) => {
    const timeInvalidatorId = tokenManagerData.parsed.invalidators.filter(
      (invalidator) =>
        accountsById[invalidator.toString()]?.owner?.toString() ===
        TIME_INVALIDATOR_ADDRESS.toString()
    )[0]
    const useInvalidatorId = tokenManagerData.parsed.invalidators.filter(
      (invalidator) =>
        accountsById[invalidator.toString()]?.owner?.toString() ===
        USE_INVALIDATOR_ADDRESS.toString()
    )[0]
    return {
      mint: (accountsById[tokenManagerData.parsed.mint.toString()] ??
        null) as AccountData<spl.Mint> | null,
      editionData: accountsById[editionIds[i]!.toString()] as
        | AccountData<metaplex.Edition | metaplex.MasterEditionV2>
        | undefined,
      recipientTokenAccount: tokenManagerData.parsed.recipientTokenAccount
        ? (accountsById[
            tokenManagerData.parsed.recipientTokenAccount?.toString()
          ] as AccountData<spl.Account>)
        : undefined,
      metaplexData: metaplexDataById[tokenManagerData.pubkey.toString()],
      tokenManager: tokenManagerData,
      metadata: metadataById[tokenManagerData.pubkey.toString()],
      claimApprover: tokenManagerData.parsed.claimApprover?.toString()
        ? (accountsById[
            tokenManagerData.parsed.claimApprover?.toString()
          ] as AccountData<PaidClaimApproverData>)
        : undefined,
      useInvalidator: useInvalidatorId
        ? (accountsById[
            useInvalidatorId.toString()
          ] as AccountData<UseInvalidatorData>)
        : undefined,
      timeInvalidator: timeInvalidatorId
        ? (accountsById[
            timeInvalidatorId.toString()
          ] as AccountData<TimeInvalidatorData>)
        : undefined,
    }
  })
}

export async function getTokenData(
  connection: Connection,
  tokenManagerIdOrMintId: PublicKey
): Promise<SingleTokenData> {
  const tokenManagerData = await tokenManager.accounts
    .getTokenManager(connection, tokenManagerIdOrMintId)
    .catch(async () => {
      const tmId = findTokenManagerAddress(tokenManagerIdOrMintId)
      return tokenManager.accounts.getTokenManager(connection, tmId)
    })

  const metaplexId = findMintMetadataId(tokenManagerData.parsed.mint)
  const metaplexDataRaw = await metaplex.Metadata.fromAccountAddress(
    connection,
    metaplexId
  ).catch((e) => {
    console.log('Failed to get metaplex data', e)
    return null
  })
  const metaplexData = metaplexDataRaw
    ? {
        pubkey: metaplexId,
        parsed: metaplexDataRaw,
      }
    : undefined

  // TODO lookup metaplex in parallel
  const idsToFetch = [
    tokenManagerData.parsed.claimApprover,
    tokenManagerData.parsed.recipientTokenAccount,
    ...tokenManagerData.parsed.invalidators,
  ]
  const accountsById = await fetchAccountDataById(connection, idsToFetch)

  let metadata: AccountData<any> | null = null
  if (metaplexData) {
    try {
      const json = await fetch(metaplexData.parsed.data.uri).then((r) =>
        r.json()
      )
      metadata = { pubkey: metaplexData.pubkey, parsed: json }
    } catch (e) {
      console.log('Failed to get metadata data', e)
    }
  }

  let recipientTokenAccount: AccountData<spl.Account> | null = null
  if (tokenManagerData?.parsed.recipientTokenAccount) {
    try {
      const recipientTokenAccountParsed = await getAccount(
        connection,
        tokenManagerData?.parsed.recipientTokenAccount
      )
      recipientTokenAccount = {
        pubkey: tokenManagerData?.parsed.recipientTokenAccount,
        parsed: recipientTokenAccountParsed,
      }
    } catch (e) {
      console.log('Failed to get recipient token account', e)
    }
  }

  const timeInvalidatorId = tokenManagerData.parsed.invalidators.filter(
    (invalidator) =>
      accountsById[invalidator.toString()]?.owner.equals(
        TIME_INVALIDATOR_ADDRESS
      )
  )[0]
  const useInvalidatorId = tokenManagerData.parsed.invalidators.filter(
    (invalidator) =>
      accountsById[invalidator.toString()]?.owner.equals(
        USE_INVALIDATOR_ADDRESS
      )
  )[0]
  return {
    metaplexData,
    tokenManager: tokenManagerData,
    claimApprover:
      tokenManagerData.parsed.claimApprover?.toString() &&
      accountsById[tokenManagerData.parsed.claimApprover?.toString()]?.type ===
        'paidClaimApprover'
        ? (accountsById[
            tokenManagerData.parsed.claimApprover?.toString()
          ] as AccountData<PaidClaimApproverData>)
        : undefined,
    useInvalidator: useInvalidatorId
      ? (accountsById[
          useInvalidatorId.toString()
        ] as AccountData<UseInvalidatorData>)
      : undefined,
    timeInvalidator: timeInvalidatorId
      ? (accountsById[
          timeInvalidatorId.toString()
        ] as AccountData<TimeInvalidatorData>)
      : undefined,
    metadata: metadata ?? undefined,
    recipientTokenAccount: recipientTokenAccount ?? undefined,
  }
}
