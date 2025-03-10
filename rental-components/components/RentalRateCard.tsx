import {
  InvalidationType,
  TokenManagerState,
} from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import { BN } from '@coral-xyz/anchor'
import { css } from '@emotion/react'
import type { Keypair } from '@solana/web3.js'
import { DatePicker } from 'antd'
import type { TokenData } from 'apis/api'
import { Alert } from 'common/Alert'
import { Button } from 'common/Button'
import { DurationInput } from 'common/DurationInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { getRentalRateDisplayText } from 'common/NFTIssuerInfo'
import { RentalSummary } from 'common/RentalSummary'
import { Toggle } from 'common/Toggle'
import { Tooltip } from 'common/Tooltip'
import { useHandleRateRental } from 'handlers/useHandleRateRental'
import { useHandleUpdateInvalidationType } from 'handlers/useHandleUpdateInvalidationType'
import { useHandleUpdateMaxExpiration } from 'handlers/useHandleUpdateMaxExpiration'
import { useManagedTokens } from 'hooks/useManagedTokens'
import { usePaymentMints } from 'hooks/usePaymentMints'
import { useWalletId } from 'hooks/useWalletId'
import moment from 'moment'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useModal } from 'providers/ModalProvider'
import { useProjectConfig } from 'providers/ProjectConfigProvider'
import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { PoweredByFooter } from 'rental-components/common/PoweredByFooter'
import { RentalClaimCardTokenHeader } from 'rental-components/common/RentalCardTokenHeader'

import { RentalSuccessCard } from './RentalSuccessCard'

export type RentalRateCardProps = {
  claim?: boolean
  tokenData: TokenData
  otpKeypair?: Keypair
}

export const RentalRateText = ({ tokenData }: { tokenData: TokenData }) => {
  const { maxExpiration } = tokenData.timeInvalidator?.parsed || {}
  if (!maxExpiration) return <></>
  return (
    <p className="mb-2 flex flex-col gap-4 text-center text-[16px] text-gray-800">
      <span className="mb-2 text-[13px] text-gray-500">
        This NFT can be rented for a specified duration<br></br>
        <b>Max rental duration:&nbsp;</b>{' '}
        {maxExpiration
          ? `${new Date(maxExpiration?.toNumber() * 1000).toLocaleString(
              'en-US',
              {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: undefined,
              }
            )}
          `
          : 'N/A'}{' '}
        (Local time)
      </span>
    </p>
  )
}

export const RentalRateInfo = ({ tokenData }: { tokenData: TokenData }) => {
  const { onDismiss } = useModal()
  const managedTokens = useManagedTokens()
  const { maxExpiration } = tokenData.timeInvalidator?.parsed || {}
  const { configFromToken } = useProjectConfig()
  const config = configFromToken(tokenData)
  const paymentMints = usePaymentMints()
  const walletId = useWalletId()
  const [newMaxExpiration, setNewMaxExpiration] = useState<number | undefined>(
    maxExpiration?.toNumber()
  )
  const canEdit =
    walletId?.toString() === tokenData.tokenManager?.parsed.issuer.toString()
  const handleUpdateMaxExpiration = useHandleUpdateMaxExpiration()
  const handleUpdateInvalidationType = useHandleUpdateInvalidationType()

  return (
    <div className="flex justify-between gap-4 text-base">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-light-0">
          Max expiration
        </div>
        {canEdit ? (
          handleUpdateMaxExpiration.isLoading ? (
            <div className="h-[38px] w-full animate-pulse rounded-md bg-border" />
          ) : (
            <DatePicker
              className="rounded-xl bg-dark-4 px-3 py-2 text-base"
              css={css`
                input {
                  line-height: 1.5rem !important;
                }
              `}
              value={
                maxExpiration
                  ? moment((newMaxExpiration ?? 0) * 1000)
                  : undefined
              }
              showTime
              onChange={(e) => {
                const newMaxExpiration = e ? e.valueOf() / 1000 : undefined
                setNewMaxExpiration(e ? e.valueOf() / 1000 : undefined)
                handleUpdateMaxExpiration.mutate({
                  tokenData,
                  maxExpiration: newMaxExpiration
                    ? new BN(newMaxExpiration)
                    : undefined,
                })
              }}
            />
          )
        ) : (
          <div className="text-medium-3">
            {maxExpiration &&
              new Date(maxExpiration.toNumber() * 1000).toLocaleString(
                'en-US',
                {
                  month: 'numeric',
                  day: 'numeric',
                  year: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                }
              )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="mb-2 text-light-0">Rental rate</div>
        <div className="text-medium-3">
          {getRentalRateDisplayText(config, tokenData, paymentMints.data)}
        </div>
      </div>
      {canEdit &&
        (tokenData.tokenManager?.parsed.invalidationType ===
          InvalidationType.Reissue ||
          tokenData.tokenManager?.parsed.invalidationType ===
            InvalidationType.Return) &&
        tokenData.timeInvalidator?.parsed.maxExpiration?.toNumber() !==
          tokenData.timeInvalidator?.parsed.expiration?.toNumber() && (
          <div className="flex flex-col gap-3">
            <Tooltip
              title={
                tokenData.tokenManager?.parsed.invalidationType ===
                InvalidationType.Reissue
                  ? 'After the rental expiration this NFT will be automatically relisted on the marketplace.'
                  : 'Upon the rental expiration this NFT will be securely returned into your wallet.'
              }
            >
              <div className="mb-2 flex items-center gap-2 text-light-0">
                Relisting
              </div>
            </Tooltip>
            {handleUpdateInvalidationType.isLoading ? (
              <div className="h-[25px] w-full animate-pulse rounded-md bg-border" />
            ) : (
              <div className="flex text-medium-3">
                <Toggle
                  defaultValue={
                    tokenData.tokenManager?.parsed.invalidationType ===
                    InvalidationType.Reissue
                  }
                  onChange={() => {
                    const newMaxExpiration =
                      tokenData.tokenManager?.parsed.state ===
                      TokenManagerState.Claimed
                        ? tokenData.timeInvalidator?.parsed.expiration
                        : undefined

                    handleUpdateInvalidationType.mutate(
                      {
                        tokenData: tokenData,
                        newInvalidationType:
                          tokenData.tokenManager?.parsed.invalidationType ===
                          InvalidationType.Return
                            ? InvalidationType.Reissue
                            : InvalidationType.Return,
                        newMaxExpiration: newMaxExpiration ?? undefined,
                      },
                      {
                        onSuccess: () => {
                          managedTokens.refetch()
                          onDismiss()
                        },
                      }
                    )
                  }}
                ></Toggle>
              </div>
            )}
          </div>
        )}
    </div>
  )
}

export const RentalRateCard = ({
  tokenData,
  otpKeypair,
  claim = true,
}: RentalRateCardProps) => {
  const [error, setError] = useState<string>()
  const [txid, setTxid] = useState<string>()
  const handleRateRental = useHandleRateRental()
  const { environment } = useEnvironmentCtx()
  const { configFromToken } = useProjectConfig()
  const config = configFromToken(tokenData)
  const paymentMints = usePaymentMints()

  const {
    extensionPaymentAmount,
    extensionPaymentMint,
    durationSeconds,
    maxExpiration,
  } = tokenData.timeInvalidator?.parsed || {}

  const [currentExtensionSeconds, setCurrentExtensionSeconds] = useState(0)

  if (!extensionPaymentAmount || !extensionPaymentMint || !durationSeconds) {
    return <>Incorrect extension parameters</>
  }

  const exceedMaxExpiration = () => {
    return !!(
      tokenData.tokenManager &&
      currentExtensionSeconds &&
      maxExpiration &&
      maxExpiration.toNumber() <
        tokenData.tokenManager.parsed.stateChangedAt.toNumber() +
          durationSeconds.toNumber() +
          currentExtensionSeconds
    )
  }

  if (txid && claim)
    return (
      <RentalSuccessCard
        tokenData={tokenData}
        extensionSeconds={currentExtensionSeconds}
        txid={txid}
      />
    )
  return (
    <div className="rounded-lg bg-dark-6 p-6">
      <RentalClaimCardTokenHeader tokenData={tokenData} />
      <RentalRateText tokenData={tokenData} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <div>
            <div className="mb-1 text-base text-light-0">Rental duration</div>
            <DurationInput
              defaultAmount={0}
              handleChange={(v) => setCurrentExtensionSeconds(v)}
            />
          </div>
          <div>
            <div className="mb-3 text-base text-light-0">Rental rate</div>
            <div className="text-base text-medium-3">
              {getRentalRateDisplayText(config, tokenData, paymentMints.data)}
            </div>
          </div>
        </div>
        <RentalSummary
          tokenData={tokenData}
          extensionSeconds={currentExtensionSeconds}
        />
        {exceedMaxExpiration() && (
          <Alert variant="error">Extension amount exceeds max expiration</Alert>
        )}
        {txid && (
          <Alert variant="success">
            Congratulations! You have succesfully{' '}
            {claim ? 'claimed ' : 'extended '}your rental with transaction shown{' '}
            <a
              className="text-blue-500"
              href={`https://explorer.solana.com/tx/${txid}?cluster=${
                environment.label?.toString() ?? ''
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
          </Alert>
        )}
        {error && (
          <Alert variant="error" showClose onClick={() => setError(undefined)}>
            {error}
          </Alert>
        )}
        <Button
          variant="primary"
          className="h-12"
          disabled={exceedMaxExpiration()}
          onClick={() =>
            handleRateRental.mutate(
              {
                tokenData: {
                  claimApprover: tokenData.claimApprover,
                  tokenManager: tokenData.tokenManager,
                  timeInvalidator: tokenData.timeInvalidator,
                },
                extensionSeconds: currentExtensionSeconds,
                claim,
                otpKeypair,
              },
              {
                onSuccess: (txid) => {
                  setTxid(txid)
                },
                onError: (e) => {
                  setTxid(undefined)
                  setError(`${e}`)
                },
              }
            )
          }
        >
          {handleRateRental.isLoading ? (
            <LoadingSpinner height="25px" />
          ) : (
            <div
              style={{ gap: '5px' }}
              className="flex items-center justify-center text-base"
            >
              {claim ? 'Rent NFT' : 'Extend Rental'}
              <FiSend />
            </div>
          )}
        </Button>
      </div>
      <PoweredByFooter />
    </div>
  )
}

export const useRentalRateCard = () => {
  const { showModal } = useModal()
  return {
    showModal: (params: RentalRateCardProps) =>
      showModal(<RentalRateCard {...params} />),
  }
}
