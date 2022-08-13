import type { TokenData } from 'apis/api'
import type { AirdropMetadata } from 'common/Airdrop'
import type { IconKey } from 'common/Socials'
import type {
  DurationOption,
  RentalCardConfig,
} from 'rental-components/components/RentalIssueCard'

import type { UserTokenData } from '../hooks/useUserTokenData'

export const COLORS = {
  primary: '#907EFF',
  accent: '#7EFFE8',
  glow: '#CE81F4',
  'light-0': '#FFFFFF',
  'light-1': '#F5E2FF',
  'light-2': '#B1AFBB',
  'medium-3': '#8D8B9B',
  'medium-4': '#6D6C7C',
  'dark-5': '#0B0B0B',
  'dark-6': '#000000',
}

export type Colors = {
  accent: string
  glow: string
}

export type TokenFilter = {
  type: 'creators' | 'issuer' | 'state' | 'claimer' | 'owner'
  value: string[]
}

export interface TokenSection {
  id: string
  header?: string
  description?: string
  icon?:
    | 'time'
    | 'featured'
    | 'listed'
    | 'rented'
    | 'available'
    | 'info'
    | 'performance'
  filter?: TokenFilter
  tokens?: TokenData[] | UserTokenData[]
  showEmpty?: boolean
}

export type Badge = {
  badgeType: 'recent' | 'trending' | 'expiration'
  position?: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'
  content?: JSX.Element | string
}

export type ProjectConfig = {
  type: 'Collection' | 'Guild'
  hidden?: boolean
  indexDisabled?: boolean
  indexMetadataDisabled?: boolean
  issuedOnly?: boolean
  name: string
  displayName: string
  websiteUrl: string
  hero?: string
  description?: string
  twitterHandle?: string
  socialLinks?: {
    icon: IconKey
    link: string
  }[]
  disallowedMints?: string[]
  logoImage: string
  logoPadding?: boolean
  colors: Colors
  badges?: Badge[]
  disableListing?: boolean
  filter?: TokenFilter
  subFilters?: { label: string; filter: TokenFilter }[]
  sections?: TokenSection[]
  rentalCard: RentalCardConfig
  airdrops?: AirdropMetadata[]
  showUnknownInvalidators?: boolean
  marketplaceRate?: DurationOption
  allowOneByCreators?: {
    address: string
    enforceTwitter: boolean
    preventMultipleClaims: boolean
    disableReturn: boolean
  }[]
}

export const projectConfigs: { [key: string]: ProjectConfig } = {
  miniroyale: {
    name: 'miniroyale',
    displayName: 'Mini Royale',
    type: 'Collection',
    websiteUrl: 'https://miniroyale.io/',
    hero: '/logos/miniroyale-hero.png',
    description:
      'Mini Royale: Nations is a browser-based first-person-shooter set on top of a land strategy game. Players can earn mintable items through Battle Pass and Quests, join or create Clans to participate in Clan Wars, fuse weapons and characters for ultra rare skins, and more.',
    logoImage: '/logos/miniroyale.png',
    twitterHandle: '@MiniNations',
    colors: {
      accent: '#2584df',
      glow: '#2584df',
    },
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/invite/miniroyale',
      },
      {
        icon: 'web',
        link: 'https://miniroyale.io/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/MiniNations',
      },
    ],
    badges: [{ badgeType: 'trending' }],
    filter: {
      type: 'creators',
      value: [
        'CbPuZtVMAWwPySvsUAEbZhe8y9rkeAZ5qLhsGBVvtau9', // S1
        'EoYTpE5HuTaXkN2AWDAgGA3JbhtPdeqnUiY9rdG7hMf', // S1
        'EpgYkzyAXPDq11G5ngctWcjq7pKSfUtEnjVcYPs2jhGY', // S2
        '3TVyY5Tw9CuKj7EJwaawacDqBM5jnbeL1kRUvhDPvxH4', // S2
        'GgT69RnQwQhE8cmnTivRHSPfvXwd3HirdbnHQBaHgqwt', // Sank
        '4hgG6XRBwGNsFpuCnBJMGi9iQteWmULM4nX6zSsgDKgz', // Sank
      ],
    },
    subFilters: [
      {
        label: 'Season 2',
        filter: {
          type: 'creators',
          value: [
            'EpgYkzyAXPDq11G5ngctWcjq7pKSfUtEnjVcYPs2jhGY',
            '3TVyY5Tw9CuKj7EJwaawacDqBM5jnbeL1kRUvhDPvxH4',
          ],
        },
      },
      {
        label: 'Season 1',
        filter: {
          type: 'creators',
          value: [
            'CbPuZtVMAWwPySvsUAEbZhe8y9rkeAZ5qLhsGBVvtau9',
            'EoYTpE5HuTaXkN2AWDAgGA3JbhtPdeqnUiY9rdG7hMf',
          ],
        },
      },
      {
        label: 'Sank season',
        filter: {
          type: 'creators',
          value: [
            'GgT69RnQwQhE8cmnTivRHSPfvXwd3HirdbnHQBaHgqwt',
            '4hgG6XRBwGNsFpuCnBJMGi9iQteWmULM4nX6zSsgDKgz',
          ],
        },
      },
    ],
    rentalCard: {
      invalidators: ['rate', 'duration', 'expiration', 'manual'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue', 'return'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
    airdrops: [
      {
        name: 'Miniverse Hero #03016',
        symbol: 'MINIROYALE',
        uri: 'https://arweave.net/QfhzPB4a2txBl1Myumyq4431klq6HjDUwacPfS07W4Y',
      },
      {
        name: 'Miniverse Weapon #184776',
        symbol: 'MINIROYALE',
        uri: 'https://arweave.net/amSCKytNSZy5cxuoJx-PSY0qMQK6ZAZzD4QnzyMzvBk',
      },
      {
        name: 'Miniverse Hero #0720',
        symbol: 'MINIROYALE',
        uri: 'https://bafybeiat55vtqutsbtyz5u3ufjru7iiv6giete4bdu3mbgqhaxjvnelc7u.ipfs.nftstorage.link/89.json',
      },
      {
        name: 'Miniverse Weapon #27339',
        symbol: 'MINIROYALE',
        uri: 'https://tokens.miniroyale.io/token-data?expires=4806495451&id=904c950a-309b-4fee-9bd4-504771ed2df9&token=BhknUWE6vXAElVhxWKE-YX6_4_acumpPP8q3ZQnsvR8',
      },
    ],
  },
  hoa: {
    name: 'hoa',
    displayName: 'Homeowners Association (Parcl)',
    type: 'Collection',
    websiteUrl: 'https://www.hoa.house/',
    hero: '/logos/parcl-hero.png',
    description:
      'Homeowners Association (HOA) is an NFT project by Parcl, consisting of 7,777 unique combinations of iconic homes from four unique cities.',
    logoImage: '/logos/parcl.gif',
    colors: {
      accent: '#10abf0',
      glow: '#005eff',
    },
    twitterHandle: '@parcl',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/parcl',
      },
      {
        icon: 'web',
        link: 'https://www.hoa.house/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/parcl',
      },
    ],
    badges: [{ badgeType: 'trending' }],
    filter: {
      type: 'creators',
      value: ['Cp3Fn6azbwtSG9LV1BWtQcAkQQiaQWDkc2LcqwaEuLuq'],
    },
    rentalCard: {
      invalidators: ['rate'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
    airdrops: [],
  },
  portals: {
    name: 'portals',
    displayName: 'Portals',
    type: 'Collection',
    websiteUrl: 'https://theportal.to/',
    logoImage: '/logos/portals.svg',
    logoPadding: true,
    colors: {
      accent: '#80ddef',
      glow: '#80ddef',
    },
    hero: '/logos/portals-hero.png',
    twitterHandle: '@_portals_',
    description:
      'The Metaverse on Solana. Explore downtown, invite friends, chat, build, show off your NFTs — right in the browser.',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/9uMBaCPW3f',
      },
      {
        icon: 'web',
        link: 'https://theportal.to/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/_portals_',
      },
    ],
    filter: {
      type: 'creators',
      value: ['5grvMeoBqv5ZdHq9JMy5RrxLPNAt1nzc9cpqYWFUwizz'],
    },
    rentalCard: {
      invalidators: ['rate', 'expiration', 'duration', 'manual'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue', 'return'],
        customInvalidationTypes: {
          '41qJ9dJemw8mrry2BD1wU6B2aHXN4RoNY79bS7xwDPhM': ['return'],
        },
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    airdrops: [
      {
        name: 'Portals',
        symbol: 'PRTL',
        uri: 'https://arweave.net/-QsrbBfmFy4Fxp-BtSnSFiajm_KECo5ctRXR6uSBS5k',
      },
      {
        name: 'Portals',
        symbol: 'PRTL',
        uri: 'https://arweave.net/RewRYM3lf-1Ry1hitgsiXuqsuERSujlTAChgl9S483c',
      },
      {
        name: 'Portals',
        symbol: 'PRTL',
        uri: 'https://arweave.net/6ZcTxyREtg0WsOSGSBq-CSyQ3DPlU1k4R_A7mrgehRE',
      },
    ],
    marketplaceRate: 'days',
  },
  smb: {
    name: 'smb',
    displayName: 'Solana Monkey Business',
    type: 'Collection',
    websiteUrl: 'https://market.solanamonkey.business/',
    logoImage: '/logos/smb-large.png',
    hero: '/logos/smb-hero.png',
    description: '5000 inspired generative NFTs.',
    twitterHandle: '@SolanaMBS',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/invite/solanamonkeybusiness',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/SolanaMBS',
      },
      {
        icon: 'web',
        link: 'https://solanamonkey.business/',
      },
    ],
    colors: {
      accent: '#cccdff',
      glow: '#cccdff',
    },
    filter: {
      type: 'creators',
      value: ['9uBX3ASjxWvNBAD1xjbVaKA74mWGZys3RGSF7DdeDD3F'],
    },
    showUnknownInvalidators: true,
    rentalCard: {
      invalidators: ['rate', 'duration', 'manual'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    airdrops: [
      {
        name: 'SMB #1148',
        symbol: 'SMB',
        uri: 'https://arweave.net/c2i2nLtanzMcWqLwFOE9yiwHoJ1WdvJcpdS54drBD9g',
      },
      {
        name: 'SMB #2712',
        symbol: 'SMB',
        uri: 'https://arweave.net/xhUWFiFbhEz6EjzE05XNvYvpP5U43bNRXvtSKku12oA',
      },
      {
        name: 'SMB #931',
        symbol: 'SMB',
        uri: 'https://arweave.net/d8IpVzCnR5sqkmimkbpxUKj4CLiOQl89ASvt6dTTyWA',
      },
      {
        name: 'SMB #1785',
        symbol: 'SMB',
        uri: 'https://arweave.net/JR_l_iOJVvVSiuySnFKsMbDtZ61deFwkr4-wch_TJzc',
      },
    ],
    marketplaceRate: 'days',
  },
  nftsoloist: {
    name: 'nftsoloist',
    displayName: 'NFTSoloist Genesis Pass',
    type: 'Collection',
    websiteUrl: 'https://nftnerds.ai/',
    logoImage: '/logos/nftsoloist.png',
    hero: '/logos/nftsoloist-hero.png',
    description:
      '250 Genesis Passes for early supporters of NFTSoloist. Grants full access to https://nftsoloist.ai',
    colors: {
      accent: '#8863d4',
      glow: '#8863d4',
    },
    twitterHandle: '@NFTNerdsAI',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/invite/nftnerds',
      },
      {
        icon: 'web',
        link: 'https://www.hoa.house/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/NFTNerdsAI',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'creators',
      value: ['FpJ3h2dzuvmdedmuV4ECz8S31RacnCxiw2ykXNhMntVt'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  solrarity: {
    name: 'solrarity',
    displayName: 'SolRarity Rarikeys',
    type: 'Collection',
    websiteUrl: 'https://solrarity.app/',
    logoImage: '/logos/solrarity.png',
    logoPadding: true,
    hero: '/logos/solrarity-hero.png',
    description:
      '2,600 unique Rarikeys allowing you to be part of SolRarity journey in the Solana ecosystem. Hold these precious keys to unlock access to premium tools and more...',
    colors: {
      accent: '#d40e99',
      glow: '#d40e99',
    },
    twitterHandle: '@NFTNerdsAI',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/solrarity',
      },
      {
        icon: 'web',
        link: 'https://solrarity.app/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/SolRarity_',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'creators',
      value: ['53EmnGdMxnmNcaPUE6wJ2NHz6iUVpge4a7RViTdfb8Dq'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  degenape: {
    name: 'degenape',
    displayName: 'Degenerate Ape Academy',
    type: 'Collection',
    websiteUrl: 'https://degenape.academy/',
    logoImage: '/logos/degenape.png',
    logoPadding: true,
    hero: '/logos/degenape-hero.png',
    description:
      'Our mission here at the academy is simple: Take 10,000 of the smoothest brained apes, put them all in one location and let the mayhem ensue. The academy was founded on the principles of friendship making, crayon eating and absolute, unregulated, deplorable, degenerate behaviour. Welcome fellow apes, to the Degenerate Ape Academy.',
    twitterHandle: '@DegenApeAcademy',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/invite/degendaoo',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/DegenApeAcademy',
      },
      {
        icon: 'web',
        link: 'https://degenape.academy/',
      },
    ],
    colors: {
      accent: '#e0b23d',
      glow: '#e0b23d',
    },
    filter: {
      type: 'creators',
      value: ['DC2mkgwhy56w3viNtHDjJQmc7SGu2QX785bS4aexojwX'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration', 'manual'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  'serum-surfers': {
    name: 'serum-surfers',
    displayName: 'Serum Surfers',
    type: 'Collection',
    websiteUrl: 'https://www.projectserum.com/',
    badges: [{ badgeType: 'recent' }],
    logoImage: '/logos/serum-surfers.png',
    hero: '/logos/serum-surfers-hero.png',
    description:
      'The Serum Surfers are a collection of 5,000 generative NFTs minted and launched on Solana through Burnt Finance’s Ignition Launchpad. They are a special homage to the Solana network’s inception, where founders Raj Gokal and Anatoly Yakovenko surfed alongside many of the early employees at Solana Beach, California. The Serum Surfers are the centerpiece of the quickly growing Serum NFT Ecosystem, and a key access ticket to everything it has in store!',
    twitterHandle: '@SurfersDAO',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/invite/projectserum',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/SurfersDAO',
      },
      {
        icon: 'web',
        link: 'https://www.projectserum.com/',
      },
    ],
    colors: {
      accent: '#49cbde',
      glow: '#49cbde',
    },
    filter: {
      type: 'creators',
      value: ['5v3tpTWZmn8JCzTFVE3eZLLQhhqSLLmTcRR2DZ8Gx2JX'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  scalpempire: {
    name: 'scalpempire',
    displayName: 'Scalp Empire',
    type: 'Collection',
    websiteUrl: 'https://www.scalp-empire.com/',
    logoImage: '/logos/scalpempire.png',
    hero: '/logos/scalpempire-hero.png',
    colors: {
      accent: '#93c34d',
      glow: '#93c34d',
    },
    description:
      "Scalp Empire Nestor Collection is all about Nestor's journey in-between realms. From Midgar to Asgard, you will see him evolve in different shapes, colors, and universes. This NFT will give you access to a collection of tools made by Scalp Empire. We have everything that will help you trade NFTs.",
    twitterHandle: '@ScalpEmpireNFT',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.com/invite/scalpempire',
      },
      {
        icon: 'web',
        link: 'https://www.scalp-empire.com/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/ScalpEmpireNFT',
      },
    ],
    filter: {
      type: 'creators',
      value: ['5g3T8224Ha5as4Ho7tcRxsHQFr4pzeEa1wEtnir93m3t'],
    },
    badges: [{ badgeType: 'recent' }],
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  rooniverse: {
    name: 'rooniverse',
    displayName: 'Rooniverse',
    type: 'Collection',
    websiteUrl: 'https://www.playrooniverse.com/',
    logoImage: '/logos/rooniverse.png',
    hero: '/logos/rooniverse-hero.png',
    colors: {
      accent: '#b338ef',
      // #1abfdd alternative
      glow: '#b338ef',
    },
    description:
      'Enter the world of savage, tribal Roos who fight to the death for sport and glory! Collect resources across lands, battle with friends, and build your own corner of Rooniverse! Adopt a Roo to access our Mini-Rooyale pre-alpha demo sessions!',
    twitterHandle: '@playrooniverse',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/rooniverse',
      },
      {
        icon: 'web',
        link: 'https://www.playrooniverse.com/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/playrooniverse',
      },
    ],
    filter: {
      type: 'creators',
      value: [
        '3v6SQ2s8w5TYYzXeS5QLn2AD3sfwQLsg9HM3W2t2QDqE',
        'FzeXx41UqWRqYxic3ftehHSTeq5bmaruYbsMrBn4b9qv',
      ],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  br1: {
    name: 'br1',
    displayName: 'BR1',
    type: 'Collection',
    websiteUrl: 'https://www.br1game.com/',
    logoImage:
      'https://static.wixstatic.com/media/a5e645_ede493815397419cad3c618bd7cb4aa4~mv2.png/v1/fill/w_888,h_390,al_c,usm_0.66_1.00_0.01,enc_auto/Artboard%202%20copy%204-1.png',
    colors: {
      accent: 'rgb(169,60,239)',
      glow: 'rgb(169,60,239)',
    },
    twitterHandle: '@BR1INFINITE',
    filter: {
      type: 'creators',
      value: [
        '9yz273zB6rQHyptbSpVvC75o4G17NwJrTk4u2ZiNV3tZ',
        'BTzGQ6yk1uFN9q9Po3LGSvmZ3dxq8nf8WPwr4D12APxo',
      ],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        freezeRentalRateDuration: {
          value: '1',
          durationOption: 'days',
        },
        durationOptions: ['hours', 'days', 'weeks'],
        visibilities: ['public'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        setClaimRentalReceipt: true,
        showClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  defiland: {
    name: 'defiland',
    displayName: 'Defi Land',
    type: 'Collection',
    websiteUrl: 'https://www.defiland.app/',
    logoImage: 'https://defiland.app/_nuxt/img/defiland.74b3850.svg',
    logoPadding: true,
    colors: {
      accent: '#CD9373',
      glow: '#CD9373',
    },
    twitterHandle: '@DeFi_Land',
    filter: {
      type: 'creators',
      value: [
        '4exgPiVhpromTi8duBsMnscoodAjU1as13s1AXZGsGHP', // harvester
        'FF1uGW7AUvUBskvWNqda1ehFX1jCkvaUk6FRcbWUEaBw', // harvester
        '3XE8DuYzqZLKr1XqXrvADRTxXWL91KuakqsKfD3cYoLP', // gun
        '5XTbjtKM1whecjXMMdDUz3BzWqEDRuJxTRPX3xTF1qmG',
        'Ajp7uzkyPUU35pGdkjZd9Gbe4zgDQXterWY8ZzvP4sCk', // boat
        '8m4TTZz3RsDVakDSwn7T89GyButxLiMqn2zq7DWfANu7', // cat, cow, dog
        '5B9AwfGpR5GRYTipUrFuvishUmPA86R5E1JcGodEsPq1', // fishing rod
        'CDNsHymcJadDkoXxzhpDe2i6723ezm15QZqkEP91uXij', // harverster 2
        'DhHpYwT9oy75BB8XXb8Fz6HBLxktwqc1yhUPvcCg5GPB', // gun 2
      ],
    },
    indexMetadataDisabled: true,
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        freezeRentalRateDuration: {
          value: '1',
          durationOption: 'days',
        },
        durationOptions: ['hours', 'days', 'weeks'],
        visibilities: ['public'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        setClaimRentalReceipt: true,
        showClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  metaops: {
    name: 'metaops',
    displayName: 'Meta Ops',
    type: 'Collection',
    websiteUrl: 'https://metaopsgaming.com/',
    logoImage: '/logos/metaops.png',
    logoPadding: true,
    colors: {
      accent: '#b55b5e',
      glow: '#b55b5e',
    },
    twitterHandle: '@MetaOpsGaming',
    description:
      'Team up with friends and put your skills to the test with MetaOps, a tactical 6v6 first-person shooter built on Unity. Discover how to play, earn, and own by renting a MetaOps NFT today.',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/metaops',
      },
      {
        icon: 'web',
        link: 'https://metaopsgaming.com/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/MetaOpsGaming',
      },
      {
        icon: 'twitch',
        link: 'https://www.twitch.tv/metaopsgaming',
      },
    ],

    filter: {
      type: 'creators',
      value: [
        'HZSQf9Qvdmmn1B5e7YBxWnyoafTUFtqjrw8SqvSRwace',
        'GU2nTh3aWQz4AA8Gaih5AmV8WmKt3Y8P6iwy5t9347h',
        '8CWFS9nzXtLd3LGE3GaSLYTAEUzkAoUPwmtq32nJFkSZ',
        'HMduKVo3A19U5EpQdEhPjo9hq9zfZXn8aGVYZp7Vc7fX',
      ],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        freezeRentalRateDuration: {
          value: '1',
          durationOption: 'days',
        },
        durationOptions: ['hours', 'days', 'weeks'],
        visibilities: ['public'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        setClaimRentalReceipt: true,
        showClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    airdrops: [
      {
        name: 'MetaOps PFP #4340',
        symbol: 'MOPFP',
        uri: 'https://storage.googleapis.com/fractal-launchpad-public-assets/metaops-assets/jsons/2789.json',
      },
      {
        name: 'MetaOps PFP #5553',
        symbol: 'MOPFP',
        uri: 'https://storage.googleapis.com/fractal-launchpad-public-assets/metaops-assets/jsons/3160.json',
      },
      {
        name: 'MetaOps PFP #4699',
        symbol: 'MOPFP',
        uri: 'https://storage.googleapis.com/fractal-launchpad-public-assets/metaops-assets/jsons/3102.json',
      },
      {
        name: 'MetaOps PFP #692',
        symbol: 'MOPFP',
        uri: 'https://www.magiceden.io/item-details/4r9jMVm5rXdiCLa2oMLkV2ecL3wmmcoFtsMUJJoum38r',
      },
    ],
    marketplaceRate: 'days',
  },
  psyker: {
    name: 'psyker',
    displayName: 'Psyker',
    type: 'Collection',
    websiteUrl: 'https://psyker.game/',
    logoImage: '/logos/psyker.png',
    colors: {
      accent: '#a4051d',
      glow: '#a4051d',
    },
    filter: {
      type: 'creators',
      value: [
        '8AkWaZh92FwkdPmqbR58FpTkpZjrCrRK648UWu6Kuz8',
        '3aKY2TVrHV7XnjcuYhP2gdUWqF8ra8TA4AL5qWQQz5gr',
        'Gvp1RDYLpbBQg35k3x1zpBxWhXNEPuS1jbLALDH8XCaA',
        // '2e8DoDgFZR3By185CDPJAwNE3h1QsaS1NtndM8NQi3Q5',
        // 'HMduKVo3A19U5EpQdEhPjo9hq9zfZXn8aGVYZp7Vc7fX',
      ],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        freezeRentalRateDuration: {
          value: '1',
          durationOption: 'days',
        },
        durationOptions: ['hours', 'days', 'weeks'],
        visibilities: ['public'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        setClaimRentalReceipt: true,
        showClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    airdrops: [
      {
        name: 'Keycard #1823',
        symbol: 'PSYKC',
        uri: 'https://storage.googleapis.com/fractal-launchpad-public-assets/psyker-assets/jsons/1823.json',
      },
      {
        name: 'Keycard #2157',
        symbol: 'PSYKC',
        uri: 'https://storage.googleapis.com/fractal-launchpad-public-assets/psyker-assets/jsons/2157.json',
      },
      {
        name: 'Keycard #4449',
        symbol: 'PSYKC',
        uri: 'https://storage.googleapis.com/fractal-launchpad-public-assets/psyker-assets/jsons/4449.json',
      },
      {
        name: 'Keycard #1823',
        symbol: 'PSYKC',
        uri: 'https://storage.googleapis.com/fractal-launchpad-public-assets/psyker-assets/jsons/1823.json',
      },
    ],
    marketplaceRate: 'days',
  },
  // empiredao: {
  //   name: 'empiredao',
  //   displayName: 'Empire DAO',
  //   type: 'Collection',
  //   websiteUrl: 'https://empiredao.xyz/',
  //   logoImage: '/logos/empiredao.png',
  //   colors: {
  //     accent: '#CCCDFF',
  //   },
  //   filter: {
  //     type: 'issuer',
  //     value: ['edaoJQRZZ3hfNottaxe9z5o2owJDJgL1bUChiPk15KN'],
  //   },
  //   rentalCard: {
  //     invalidators: ['expiration'],
  //     invalidationOptions: {
  //       visibilities: ['public'],
  //       durationOptions: [ 'hours', 'days', 'weeks'],
  //       invalidationTypes: ['reissue'],
  //       paymentMints: ['So11111111111111111111111111111111111111112'],
  //       showClaimRentalReceipt: false,
  //       setClaimRentalReceipt: false,
  //       maxDurationAllowed: {
  //         displayText: '3 weeks',
  //         value: 7258000,
  //       },
  //     },
  //   },
  //   marketplaceRate: 'days',
  //   airdrops: [],
  // },
  default: {
    name: 'default',
    displayName: 'Unverified',
    hidden: true,
    type: 'Collection',
    websiteUrl: 'https://cardinal.so',
    logoImage: 'https://main.cardinal.so/assets/cardinal-titled.png',
    colors: {
      accent: '#7560FF',
      glow: '#7560FF',
    },
    rentalCard: {
      invalidators: ['rate', 'duration', 'expiration', 'manual'],
      extensionOptions: { showDisablePartialExtension: true },
      invalidationOptions: {
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    indexMetadataDisabled: true,
    airdrops: [
      {
        name: 'Origin Jambo',
        symbol: 'JAMB',
        uri: 'https://arweave.net/XBoDa9TqiOZeXW_6bV8wvieD8fMQS6IHxKipwdvduCo',
      },
      {
        name: 'Solana Monkey Business',
        symbol: 'SMB',
        uri: 'https://arweave.net/VjfB54_BbELJ5bc1kH-kddrXfq5noloSjkcvK2Odhh0',
      },
      {
        name: 'Degen Ape',
        symbol: 'DAPE',
        uri: 'https://arweave.net/mWra8rTxavmbCnqxs6KoWwa0gC9uM8NMeOsyVhDy0-E',
      },
      {
        name: 'Thugbirdz',
        symbol: 'THUG',
        uri: 'https://arweave.net/l9VXqVWCsiKW-R8ShX8jknFPgBibrhQI1JRgUI9uvbw',
      },
      {
        name: 'Turtles',
        symbol: 'TRTL',
        uri: 'https://arweave.net/KKbhlHaPMOB9yMm9yG_i7PxzK0y24I5C7gNTaRDI9OE',
      },
      {
        name: 'Almost Famous Pandas',
        symbol: 'AFP',
        uri: '8cs7hpBcuiRbzcdUY5BHpCFCgv1m8JhpZEVHUkYTmhnA',
      },
      {
        name: 'Shi Guardians',
        symbol: 'SHI',
        uri: 'https://arweave.net/hSI4WIsX10yRWnzgXP8oqwSCaSgPfGU5nSN-Pxjslao',
      },
      {
        name: 'Hacker House',
        symbol: 'HH',
        uri: 'https://arweave.net/DLDhnabWSXzAYktEhEKyukt3GIfagj2rPpWncw-KDQo',
      },
      {
        name: '21 Club',
        symbol: '21',
        uri: 'https://bafkreicv3jj6oc53kid76mkk7hqsr6edrnhsydkw4do4vonq777sgfz3le.ipfs.dweb.link?ext=json',
      },
    ],
  },
  ['3dgamersguild']: {
    name: '3dgamersguild',
    displayName: '3D Gamers Guild',
    type: 'Guild',
    websiteUrl: 'https://www.3dgamersguild.com/',
    logoImage:
      'https://images.squarespace-cdn.com/content/v1/618b2aec73c8ed19abf2fd2f/c4a759b4-91d5-462a-bd6d-ce3766ffda2f/3D+Gamers+Logo+with+white+letters+white+text.png?format=1500w',
    logoPadding: true,
    colors: {
      accent: '#34659b',
      glow: '#34659b',
    },
    filter: {
      type: 'issuer',
      value: ['9qoRqZmrAf6bqtmTAPA1UkgCRvKuaugF17xBdympy1vd'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        freezeRentalRateDuration: {
          value: '1',
          durationOption: 'days',
        },
        visibilities: ['public'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  ['udderchaos']: {
    name: 'udderchaos',
    displayName: 'Udder Chaos',
    type: 'Guild',
    websiteUrl: 'https://www.udderchaos.io/',
    logoImage: 'logos/udderchaos-logo.png',
    colors: {
      accent: '#f9e7c9',
      glow: '#f9e7c9',
    },
    description:
      'Udder Chaos is a project built on a sustainable business model. Operating a Solana Validator drives consistent income for the project on top of accent sales, while also being supported by their RPC rentals and NFT rental treasury. They are also developing Alpha Audits, an NFT reviewing platform with a review-to-earn mechanism.',
    hero: 'logos/udderchaos-hero.png',
    socialLinks: [
      {
        icon: 'twitter',
        link: 'https://twitter.com/UdderChaosSOL',
      },
      {
        icon: 'discord',
        link: 'https://discord.gg/udderchaos',
      },
      {
        icon: 'web',

        link: 'https://www.udderchaos.io/',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['F65oeXXQaDQYnmQKTmmMpZ5XaLBzoUC16pMTg59RfpK6'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: [
          'MLKmUCaj1dpBY881aFsrBwR9RUMoKic8SWT3u1q5Nkj',
          'So11111111111111111111111111111111111111112',
        ],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  ['fatcats']: {
    name: 'fatcats',
    displayName: 'Fatcats',
    type: 'Guild',
    websiteUrl: 'https://fatcatscapital.com/',
    logoImage: 'logos/fatcats.png',
    logoPadding: true,
    colors: {
      accent: '#397fd6',
      glow: '#397fd6',
    },
    description:
      'The FatCats Capital Club (FCC) is a community focused on the development of projects looking to advance the Solana ecosystem as a whole. Through the FatCats Accelerator program, both holders and project creators can benefit from services the FCC provides.',
    hero: 'logos/fatcats-hero.png',
    socialLinks: [
      {
        icon: 'twitter',
        link: 'https://twitter.com/fatcatscapital',
      },
      {
        icon: 'discord',
        link: 'https://discord.com/invite/9FnX58FWVB',
      },
      {
        icon: 'web',
        link: 'https://fatcatscapital.com/',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['Dx2svFqyhm1eFQTvKrETehLmrNHpNXhioqSHpXGzp5Xe'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['FdviznPoMEakdJ37fikNxhoscyruUHSHNkKyvntSqbuo'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  ['monkettes']: {
    name: 'monkettes',
    displayName: 'The Monkettes',
    type: 'Guild',
    websiteUrl: 'https://monkettes.io/',
    logoImage: 'logos/monkettes.png',
    logoPadding: true,
    hero: 'logos/monkettes-hero.png',
    colors: {
      accent: '#fe5d9f',
      glow: '#fe5d9f',
    },
    description:
      'Be part of one of the most knowledgeable communities on Solana by holding a Monkette. Rent one out today!',
    socialLinks: [
      {
        icon: 'twitter',
        link: 'https://twitter.com/MonkettesNFT',
      },
      {
        icon: 'discord',
        link: 'https://discord.com/invite/monkettes',
      },
      {
        icon: 'web',
        link: 'https://monkettes.io/',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['22aCNyykzcpX6r1ThuZLoqgMHSzsByBBz5bbNkqpMP4q'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['8o66EVAf4u2Hr21m2tuRrPtEXFPLr8G8aL1ETStP8fDu'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  ['thedegenerates']: {
    name: 'thedegenerates',
    displayName: 'The Degenerates',
    type: 'Guild',
    websiteUrl: 'https://thedegen.app/',
    logoImage: 'logos/thedegenerates.png',
    colors: {
      accent: '#ff7921',
      glow: '#ff7921',
    },
    description:
      'For degenerates by degenerates and home for all degenerates. Slowly taking over the Solana blockchain and beyond with tool help and info such as Mint Bot and sniper features, RPC locations, Degen Alerts, Wallet Manager, RPC Tester and Listing manager. Tool reviews and ratings by your fellow degenerates. Come get your degen on!',
    hero: 'logos/thedegenerates-hero.png',
    socialLinks: [
      {
        icon: 'twitter',
        link: 'https://twitter.com/_DegeneratesNFT',
      },
      {
        icon: 'discord',
        link: 'https://discord.gg/thedegenerates',
      },
      {
        icon: 'web',
        link: 'https://thedegen.app/',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['E6m3sYbjbzCVqtMpDuWjMBnJneJu5a4VnTorz8hpCDB5'],
    },
    rentalCard: {
      invalidators: ['rate'],
      invalidationOptions: {
        visibilities: ['public'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '1 week',
          value: 604800,
        },
      },
    },
    marketplaceRate: 'days',
  },
  ['syndicate-initiative']: {
    name: 'syndicate-initiative',
    displayName: 'SyNdicate Initiative',
    type: 'Guild',
    websiteUrl: 'https://www.twitch.tv/syndicateinitiative',
    logoImage: 'logos/syndicate-initiative.png',
    colors: {
      accent: '#A45EE5',
      glow: '#A45EE5',
    },
    description:
      'Syndicate Initiative is a community of gamers focused on good vibes and competitive gaming in the developing web3 space. We coach eSports players and stream content on Twitch. Let’s build SyNi together and make a name in the web3 gaming space! #SyNi',
    hero: 'logos/syndicate-initiative-hero.png',
    socialLinks: [
      {
        icon: 'twitter',
        link: 'https://twitter.com/ItzSyNi',
      },
      {
        icon: 'discord',
        link: 'https://discord.gg/gz34uBgQMN',
      },
      {
        icon: 'web',
        link: 'https://www.twitch.tv/syndicateinitiative',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['7Rinf5mQGHccRnxE6J2p2xNFjpNCh4sgVdpsiyQ9NRHc'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  tag: {
    name: 'tag',
    displayName: 'Trading Apes Gang',
    type: 'Guild',
    websiteUrl: 'https://tradingapesgang.com/',
    logoImage: '/logos/tag.png',
    hero: '/logos/tag-hero.png',
    colors: {
      accent: '#FF080B',
      glow: '#FF080B',
    },
    description:
      'Trading Apes Gang is a Revenue Sharing project. 500 Miscreant Trading Apes competing in NFT trading competitions, All TAG NFTs with Scalp Empire access, Create Your Own Raffle Site, CoinFlip game live! Weekly competitions for SOL!',
    twitterHandle: '@tradingapesgang',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/9QPKxnyKbq',
      },
      {
        icon: 'web',
        link: 'https://tradingapesgang.com/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/TradingApesGang',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['8FkMivDfqqFLH3eRBnJ8krkbQemUfDthLcTXjwSqkQee'],
    },
    rentalCard: {
      invalidators: ['rate'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: [
          'So11111111111111111111111111111111111111112',
          'DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ',
        ],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '4 weeks',
          value: 2419200,
        },
      },
    },
    marketplaceRate: 'days',
  },
  droidcapital: {
    name: 'droidcapital',
    displayName: 'Droid Capital',
    type: 'Guild',
    websiteUrl: 'https://droidcapital.net/',
    logoImage: '/logos/droid.png',
    hero: '/logos/droid-hero.png',
    colors: {
      accent: '#981F2B',
      glow: '#981F2B',
    },
    description:
      'Droid Capital is a cross-chain hive, HQ, and home base for ALL entrepreneurial-degen-big-brains. We are an NFT based, 100% DAO managed "VC firm”',
    twitterHandle: '@droidcapital',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/droid',
      },
      {
        icon: 'web',
        link: 'https://droidcapital.net/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/droidcapital',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['35qpvWNknAxGj5BEBjcUnNybYXdnNvGbuvWJS2rpaXMZ'],
    },
    rentalCard: {
      invalidators: ['rate'],
      invalidationOptions: {
        visibilities: ['public'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: [
          'So11111111111111111111111111111111111111112',
          'GkywroLpkvYQc5dmFfd2RchVYycXZdaA5Uzix42iJdNo',
        ],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '2 weeks',
          value: 1209600,
        },
      },
    },
    marketplaceRate: 'days',
  },
  metakitchen: {
    name: 'metakitchen',
    displayName: 'metaKitchen',
    type: 'Guild',
    websiteUrl: 'https://metakitchen.io/',
    logoImage: '/logos/metakitchen.png',
    hero: '/logos/metakitchen-hero.png',
    colors: {
      accent: '#E7001B',
      glow: '#E7001B',
    },
    description:
      'metaKitchen bridges the digital and physical world of food into a Game-Fi ecosystem built for chefs, home cooks, and gamers. Through our love of food we are uniting the industry in a fully integrated culinary web3 platform.',
    twitterHandle: '@meta_Kitchen',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/ayTcwAeQpW',
      },
      {
        icon: 'web',
        link: 'https://metakitchen.io/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/meta_Kitchen',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['EFNxcRU6eidLMaVj7ZL5ikA6BqaXWYpEhaGa2hQvFAV3'],
    },
    rentalCard: {
      invalidators: ['duration'],
      invalidationOptions: {
        visibilities: ['public'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: [
          'So11111111111111111111111111111111111111112',
          '7BPCwgL97UMWcSuyUmDdNTzGnDvruyfGKTmUaSbLzohP',
        ],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '12 weeks',
          value: 7258000,
        },
      },
    },
    marketplaceRate: 'days',
  },
  solset: {
    name: 'solset',
    displayName: 'Solset',
    type: 'Guild',
    websiteUrl: 'https://solset.io',
    logoImage: '/logos/solset.png',
    hero: '/logos/solset-hero.png',
    colors: {
      accent: '#FCB316',
      glow: '#FCB316',
    },
    description:
      'Solset.io is a plug and play experience that works out of the box and offers sniping speed and precision with a simple and effective user interface. Set your snipes and forget about them until you get notified about your purchases through telegram. Welcome to the new breed of on chain snipers on Solana, welcome to Solset.io.',
    twitterHandle: '@solset_io',
    socialLinks: [
      {
        icon: 'discord',
        link: 'https://discord.gg/solset ',
      },
      {
        icon: 'web',
        link: 'https://solset.io/',
      },
      {
        icon: 'twitter',
        link: 'https://twitter.com/solset_io',
      },
    ],
    badges: [{ badgeType: 'recent' }],
    filter: {
      type: 'issuer',
      value: ['SLSETzAUois5Wfy1jAxEDPkWiwmLgRcsDSUV6GRGoR2'],
    },
    rentalCard: {
      invalidators: ['rate', 'duration'],
      invalidationOptions: {
        visibilities: ['public', 'private'],
        durationOptions: ['hours', 'days', 'weeks'],
        invalidationTypes: ['reissue'],
        paymentMints: ['So11111111111111111111111111111111111111112'],
        showClaimRentalReceipt: false,
        setClaimRentalReceipt: false,
        maxDurationAllowed: {
          displayText: '6 weeks',
          value: 3629000,
        },
      },
    },
    marketplaceRate: 'days',
  },
}
