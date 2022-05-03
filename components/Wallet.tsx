import { withInvalidate } from '@cardinal/token-manager'
import { InvalidationType } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import type { TokenData } from 'api/api'
import { Airdrop } from 'common/Airdrop'
import { Header } from 'common/Header'
import { elligibleForRent, NFT, NFTPlaceholder, TokensOuter } from 'common/NFT'
import { notify } from 'common/Notification'
import { executeTransaction } from 'common/Transactions'
import { asWallet } from 'common/Wallets'
import { lighten } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { filterTokens, useProjectConfig } from 'providers/ProjectConfigProvider'
import { useUserTokenData } from 'providers/TokenDataProvider'
import { useState } from 'react'
import { AsyncButton, Button } from 'rental-components/common/Button'
import { useRentalExtensionModal } from 'rental-components/RentalExtensionModalProvider'
import { useRentalModal } from 'rental-components/RentalModalProvider'

export const Wallet = () => {
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const { config } = useProjectConfig()
  const { tokenDatas, loaded, refreshTokenAccounts } = useUserTokenData()
  const rentalModal = useRentalModal()
  const rentalExtensionModal = useRentalExtensionModal()
  const [selectedTokens, setSelectedTokens] = useState<TokenData[]>([])

  const filteredTokenDatas = filterTokens(
    ctx.environment.label,
    tokenDatas,
    config.filter
  )

  const revokeRental = async (tokenData: TokenData) => {
    if (!tokenData.tokenManager) throw new Error('Invalid token manager')
    if (!wallet.publicKey) throw new Error('Wallet not connected')

    const transaction = new Transaction()

    await withInvalidate(
      transaction,
      ctx.connection,
      asWallet(wallet),
      tokenData.tokenManager?.parsed.mint
    )

    await executeTransaction(ctx.connection, asWallet(wallet), transaction, {
      silent: false,
      callback: refreshTokenAccounts,
    })
  }

  const isSelected = (tokenData: TokenData) => {
    return selectedTokens.some(
      (t) =>
        t.tokenAccount?.account.data.parsed.info.mint.toString() ===
        tokenData.tokenAccount?.account.data.parsed.info.mint.toString()
    )
  }

  const handleNFTSelect = (tokenData: TokenData) => {
    if (isSelected(tokenData)) {
      setSelectedTokens(
        selectedTokens.filter(
          (t) =>
            t.tokenAccount?.account.data.parsed.info.mint.toString() !==
            tokenData.tokenAccount?.account.data.parsed.info.mint.toString()
        )
      )
    } else if (elligibleForRent(config, tokenData)) {
      setSelectedTokens([...selectedTokens, tokenData])
    } else {
      notify({
        message: 'Not elligible',
        description: 'This token is not ellgibile for rent!',
      })
    }
  }

  return (
    <>
      <Header
        tabs={[
          {
            name: 'Wallet',
            anchor: wallet.publicKey?.toBase58() || 'wallet',
            disabled: !wallet.connected,
          },
          {
            name: 'Manage',
            anchor: 'manage',
            disabled: !wallet.connected || config.disableListing,
          },
          { name: 'Browse', anchor: 'browse' },
        ]}
      />
      <div className="mt-5 flex flex-col">
        {filteredTokenDatas && filteredTokenDatas.length > 0 && (
          <div className="container mx-auto mb-5 flex items-end justify-end">
            <Button
              disabled={selectedTokens.length === 0}
              variant="primary"
              className="mr-5"
              bgColor={config.colors.secondary}
              onClick={() =>
                rentalModal.show(
                  asWallet(wallet),
                  ctx.connection,
                  ctx.environment.label,
                  selectedTokens,
                  config.rentalCard
                )
              }
            >
              {`Bulk Upload ${
                selectedTokens.length ? `(${selectedTokens.length})` : ''
              }`}
            </Button>
          </div>
        )}
        <TokensOuter>
          {!loaded ? (
            <>
              <NFTPlaceholder />
              <NFTPlaceholder />
              <NFTPlaceholder />
              <NFTPlaceholder />
              <NFTPlaceholder />
              <NFTPlaceholder />
            </>
          ) : filteredTokenDatas && filteredTokenDatas.length > 0 ? (
            filteredTokenDatas.map((tokenData) => (
              <div key={tokenData.tokenAccount?.pubkey.toString()}>
                <NFT
                  key={tokenData?.tokenAccount?.pubkey.toBase58()}
                  tokenData={tokenData}
                  onClick={() => handleNFTSelect(tokenData)}
                />
                {elligibleForRent(config, tokenData) && (
                  <input
                    autoComplete="off"
                    type={'checkbox'}
                    className={`absolute top-3 left-3 h-5 w-5  rounded-sm font-medium text-black focus:outline-none`}
                    id={tokenData?.tokenAccount?.pubkey.toBase58()}
                    name={tokenData?.tokenAccount?.pubkey.toBase58()}
                    checked={isSelected(tokenData)}
                    onChange={(e) => {
                      handleNFTSelect(tokenData)
                    }}
                  />
                )}
                <div
                  style={{
                    background: lighten(0.07, config.colors.main),
                  }}
                  className="flex w-[280px] flex-row justify-between rounded-bl-md rounded-br-md p-3"
                >
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap pr-5 text-white">
                    {tokenData.metadata.data.name}
                  </p>
                  <div className="my-auto flex-col justify-items-end">
                    {tokenData.timeInvalidator?.parsed
                      ?.extensionDurationSeconds &&
                      tokenData.tokenManager && (
                        <Button
                          variant="primary"
                          className=" float-right mb-3"
                          onClick={() =>
                            rentalExtensionModal.show(
                              asWallet(wallet),
                              ctx.connection,
                              ctx.environment.label,
                              tokenData
                            )
                          }
                        >
                          Add Duration
                        </Button>
                      )}
                    {tokenData.tokenManager?.parsed &&
                      (tokenData.tokenManager.parsed.invalidationType ===
                        InvalidationType.Reissue ||
                        tokenData.tokenManager.parsed.invalidationType ===
                          InvalidationType.Return) && (
                        <AsyncButton
                          variant="primary"
                          className=" float-right my-auto"
                          handleClick={async () => {
                            try {
                              await revokeRental(tokenData)
                            } catch (e) {
                              notify({
                                message: `Return failed: ${e}`,
                                type: 'error',
                              })
                            }
                          }}
                        >
                          Return
                        </AsyncButton>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="white mt-5 flex w-full flex-col items-center justify-center gap-1">
              <div className="text-gray-500">
                No {config.name} NFTs found in wallet...
              </div>
              {ctx.environment.label === 'devnet' && <Airdrop />}
            </div>
          )}
        </TokensOuter>
      </div>
    </>
  )
}
