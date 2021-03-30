import { MenuEntry } from '@carticfinance-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Exchange',
    icon: 'TradeIcon',
    href: '/exchange',
  },
  {
    label: 'Liquidity',
    icon: 'TicketIcon',
    href: '/liquidity',
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'Overview',
        href: 'https://carticfinance.info',
      },
      {
        label: 'Whitepaper View',
        href: 'https://carticfinance.info/whitepaper',
      },
    ],
  },
]

export default config
