const allConstants = {}

/**
 * average block times for supported blockchains:
 * BTC: 10 minutes (600000ms)
 * EQB: 10 minutes
 * (Future: LTC 2.5 minutes, ETH 15 seconds)
 * @type {Object}
 */
export const blockTime = allConstants.blockTime = {
  BTC: 600000,
  EQB: 600000
}

export const supportedCurrencies = allConstants.supportedCurrencies = ['BTC', 'EQB']

export default allConstants
