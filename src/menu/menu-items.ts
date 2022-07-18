export const menuItems = [
  {
    title: 'Profit',
    dataName: 'profit',
    icon: 'assets/images/profit.svg',
    isSelected: false,
    hasData: false
  },
  {
    title: 'Forwards',
    dataName: 'forwards',
    icon: 'assets/images/forwards.svg',
    isSelected: false,
    hasData: false
  },
  {
    title: 'Keysends',
    dataName: 'keysends',
    icon: 'assets/images/keysends.svg',
    isSelected: false,
    hasData: false
  },
  {
    title: 'Payments',
    dataName: 'payments',
    icon: 'assets/images/payments.svg',
    isSelected: false,
    hasData: false
  },
  {
    title: 'Chain Fees',
    dataName: 'chainFees',
    icon: 'assets/images/chain-fees.svg',
    isSelected: false,
    hasData: false
  },
  {
    title: 'Rebalance Fees',
    dataName: 'rebalanceFees',
    icon: 'assets/images/rebalance.svg',
    isSelected: false,
    hasData: false
  },
  {
    title: 'Lightning Fees',
    dataName: 'lightningFees',
    icon: 'assets/images/lightning-fees.svg',
    isSelected: false,
    hasData: false
  }
];

export const filterMenuItems = {
  'Profit': [
    {
      title: 'Net',
      filter: 'sats',
      icon: 'assets/images/sats.svg'
    },
    {
      title: 'Cumulative',
      filter: 'cumulative',
      icon: 'assets/images/cumulative.svg'
    }
  ],
  'Forwards': [
    {
      title: 'Sats Earned',
      filter: 'sats',
      icon: 'assets/images/sats.svg'
    },
    {
      title: 'Count',
      filter: 'count',
      icon: 'assets/images/count.svg'
    },
    {
      title: 'Avg. Size',
      filter: 'routeSize',
      icon: 'assets/images/ruler.svg'
    },
    {
      title: 'Avg. PPM',
      filter: 'avgPPM',
      icon: 'assets/images/divide.svg'
    },
    {
      title: 'Avg. Earning',
      filter: 'average',
      icon: 'assets/images/average.svg'
    },
    {
      title: 'Sats Routed',
      filter: 'amountRouted',
      icon: 'assets/images/sats-routed.svg'
    },
  ],
  'Keysends': [
    {
      title: 'Sats Earned',
      filter: 'sats',
      icon: 'assets/images/sats.svg'
    },
    {
      title: 'Count',
      filter: 'count',
      icon: 'assets/images/count.svg'
    },
    {
      title: 'Avg. Size',
      filter: 'average',
      icon: 'assets/images/ruler.svg'
    }
  ],
  'Payments': [
    {
      title: 'Sats Sent',
      filter: 'sats',
      icon: 'assets/images/sats.svg'
    },
    {
      title: 'Count',
      filter: 'count',
      icon: 'assets/images/count.svg'
    },
    {
      title: 'Avg. Size',
      filter: 'average',
      icon: 'assets/images/ruler.svg'
    }
  ],
  'Chain Fees': [
    {
      title: 'Sats Spent',
      filter: 'sats',
      icon: 'assets/images/sats.svg'
    },
    {
      title: 'Count',
      filter: 'count',
      icon: 'assets/images/count.svg'
    },
    {
      title: 'Avg. Size',
      filter: 'average',
      icon: 'assets/images/ruler.svg'
    }
  ],
  'Rebalance Fees': [
    {
      title: 'Sats Spent',
      filter: 'sats',
      icon: 'assets/images/sats.svg'
    },
    {
      title: 'Count',
      filter: 'count',
      icon: 'assets/images/count.svg'
    },
    {
      title: 'Avg. Size',
      filter: 'average',
      icon: 'assets/images/ruler.svg'
    }
  ],
  'Lightning Fees': [
    {
      title: 'Sats Spent',
      filter: 'sats',
      icon: 'assets/images/sats.svg'
    },
    {
      title: 'Count',
      filter: 'count',
      icon: 'assets/images/count.svg'
    },
    {
      title: 'Avg. Size',
      filter: 'average',
      icon: 'assets/images/ruler.svg'
    }
  ]
}
