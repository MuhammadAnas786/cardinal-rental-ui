import type { NormalizedCacheObject } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import type { Cluster } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import { useRouter } from 'next/router'
import React, { useContext, useMemo, useState } from 'react'

export interface Environment {
  label: Cluster | 'mainnet' | 'localnet'
  value: string
  override?: string
  api?: string
  index?: ApolloClient<NormalizedCacheObject>
}

export interface EnvironmentContextValues {
  environment: Environment
  setEnvironment: (newEnvironment: Environment) => void
  connection: Connection
}

const INDEX_ENABLED = false

export const ENVIRONMENTS: Environment[] = [
  {
    label: 'mainnet',
    value:
      'https://solana-api.syndica.io/access-token/bkBr4li7aGVa3euVG0q4iSI6uuMiEo2jYQD35r8ytGZrksM7pdJi2a57pmlYRqCw',
    override: 'https://ssc-dao.genesysgo.net',
    index: INDEX_ENABLED
      ? new ApolloClient({
          uri: 'https://prod-holaplex.hasura.app/v1/graphql',
          cache: new InMemoryCache({ resultCaching: false }),
        })
      : undefined,
    // api: '/api',
  },
  {
    label: 'testnet',
    value: 'https://api.testnet.solana.com',
  },
  {
    label: 'devnet',
    value:
      'https://purple-old-lake.solana-devnet.quiknode.pro/13480a1cc2033abc1d3523523bc1acabd97b6874/',
  },
  {
    label: 'localnet',
    value: 'http://127.0.0.1:8899',
  },
]

const EnvironmentContext: React.Context<null | EnvironmentContextValues> =
  React.createContext<null | EnvironmentContextValues>(null)

export function EnvironmentProvider({
  children,
}: {
  children: React.ReactChild
}) {
  const { query } = useRouter()
  const cluster = (query.project || query.host)?.includes('dev')
    ? 'devnet'
    : query.cluster || process.env.BASE_CLUSTER
  const foundEnvironment = ENVIRONMENTS.find((e) => e.label === cluster)
  const [environment, setEnvironment] = useState<Environment>(
    foundEnvironment ?? ENVIRONMENTS[0]!
  )

  useMemo(() => {
    const foundEnvironment = ENVIRONMENTS.find((e) => e.label === cluster)
    setEnvironment(foundEnvironment ?? ENVIRONMENTS[2]!)
  }, [cluster])

  const connection = useMemo(
    () => new Connection(environment.value, { commitment: 'recent' }),
    [environment]
  )

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment,
        connection,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironmentCtx(): EnvironmentContextValues {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('Missing connection context')
  }
  return context
}
