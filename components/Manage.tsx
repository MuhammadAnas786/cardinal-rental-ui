import React from 'react'
import { useState } from 'react'
import { NFT, TokensOuter } from 'common/NFT'
import { useManagedTokens } from 'providers/ManagedTokensProvider'
import { LoadingSpinner } from 'rental-components/common/LoadingSpinner'
import { TokenManagerState } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import { AsyncButton } from 'rental-components/common/Button'
import { notify } from 'common/Notification'
import { shortPubKey } from 'common/utils'
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { FaLink } from 'react-icons/fa'
import { invalidate, unissueToken } from '@cardinal/token-manager'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { asWallet } from 'common/Wallets'
import { executeTransaction } from 'common/Transactions'
import { useUserTokenData } from 'providers/TokenDataProvider'
import { BN } from '@project-serum/anchor'
import { StyledTag, Tag } from 'common/Tags'
import { getLink, useProjectConfig } from 'providers/ProjectConfigProvider'

const handleCopy = (shareUrl: string) => {
  navigator.clipboard.writeText(shareUrl)
  notify({ message: 'Share link copied' })
}

export const Manage = () => {
  const { config } = useProjectConfig()
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const { refreshTokenAccounts } = useUserTokenData()
  const { managedTokens, loaded } = useManagedTokens()
  const [loadingUnissue, setLoadingUnissue] = useState(false)

  return (
    <TokensOuter>
      {managedTokens && managedTokens.length > 0 ? (
        managedTokens.map((tokenData) => (
          <div
            key={tokenData.tokenManager?.pubkey.toString()}
            style={{
              paddingTop: '10px',
              display: 'flex',
              gap: '10px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <>
              <NFT
                key={tokenData?.tokenManager?.pubkey.toBase58()}
                tokenData={tokenData}
                hideQRCode={true}
              ></NFT>
              {
                {
                  [TokenManagerState.Initialized]: <>Initiliazed</>,
                  [TokenManagerState.Issued]: (
                    <StyledTag>
                      <Tag
                        state={TokenManagerState.Issued}
                        onClick={() =>
                          handleCopy(
                            getLink(
                              `/claim/${tokenData.tokenManager?.pubkey.toBase58()}`
                            )
                          )
                        }
                        color="warning"
                      >
                        Issued by{' '}
                        {shortPubKey(tokenData.tokenManager?.parsed.issuer)}{' '}
                        {/* {shortDateString(tokenData.tokenManager?.parsed.issuedAt)} */}
                        <FaLink className="ml-1" />
                      </Tag>
                      {tokenData.tokenManager?.parsed.issuer.toBase58() ===
                        wallet.publicKey?.toBase58() && (
                        <AsyncButton
                          bgColor={config.colors.secondary}
                          variant="primary"
                          disabled={!wallet.connected}
                          handleClick={async () => {
                            try {
                              setLoadingUnissue(true)
                              if (tokenData?.tokenManager) {
                                await executeTransaction(
                                  connection,
                                  asWallet(wallet),
                                  await unissueToken(
                                    connection,
                                    asWallet(wallet),
                                    tokenData?.tokenManager?.parsed.mint
                                  ),
                                  {
                                    callback: refreshTokenAccounts,
                                    notificationConfig: {},
                                    silent: true,
                                  }
                                )
                              }
                            } catch (e) {
                              notify({
                                message: `Unissue failed: ${e}`,
                                type: 'error',
                              })
                              console.log(e)
                            } finally {
                              setLoadingUnissue(false)
                            }
                          }}
                        >
                          <>Unissue</>
                        </AsyncButton>
                      )}
                    </StyledTag>
                  ),
                  [TokenManagerState.Claimed]: (
                    <StyledTag>
                      <Tag state={TokenManagerState.Claimed}>
                        Claimed by{' '}
                        {shortPubKey(
                          tokenData.recipientTokenAccount?.owner || ''
                        )}{' '}
                        {/* {shortDateString(
                          tokenData.tokenManager?.parsed.claimedAt
                        )} */}
                      </Tag>
                      {((wallet.publicKey &&
                        tokenData?.tokenManager?.parsed.invalidators &&
                        tokenData?.tokenManager?.parsed.invalidators
                          .map((i: PublicKey) => i.toString())
                          .includes(wallet.publicKey?.toString())) ||
                        (tokenData.timeInvalidator &&
                          tokenData.timeInvalidator.parsed.expiration &&
                          tokenData.timeInvalidator.parsed.expiration.lte(
                            new BN(Date.now() / 1000)
                          )) ||
                        (tokenData.useInvalidator &&
                          tokenData.useInvalidator.parsed.maxUsages &&
                          tokenData.useInvalidator.parsed.usages.gte(
                            tokenData.useInvalidator.parsed.maxUsages
                          ))) && (
                        <AsyncButton
                          variant="primary"
                          disabled={!wallet.connected}
                          handleClick={async () => {
                            tokenData?.tokenManager &&
                              executeTransaction(
                                connection,
                                asWallet(wallet),
                                await invalidate(
                                  connection,
                                  asWallet(wallet),
                                  tokenData?.tokenManager?.parsed.mint
                                ),
                                {
                                  callback: refreshTokenAccounts,
                                  silent: true,
                                  notificationConfig: {},
                                }
                              )
                          }}
                        >
                          <>Revoke</>
                        </AsyncButton>
                      )}
                    </StyledTag>
                  ),
                  [TokenManagerState.Invalidated]: (
                    <Tag state={TokenManagerState.Invalidated}>
                      Invalidated
                      {/* {shortDateString(
                    tokenData.tokenManager?.parsed.claimedAt
                  )} */}
                    </Tag>
                  ),
                }[tokenData?.tokenManager?.parsed.state as TokenManagerState]
              }
            </>
          </div>
        ))
      ) : loaded ? (
        <div className="white flex w-full flex-col items-center justify-center gap-1">
          <div className="text-white">No outstanding tokens!</div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </TokensOuter>
  )
}
