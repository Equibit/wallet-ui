/* Script to avoid too-long-mempool-chain error by mining a block.
 * Additionally maintains balance on addresses from where we send coins to test users.
 * */

require('isomorphic-fetch')

const btcAddress = 'n28Ah3enJGgysRD4MySo41onoi5QxsjvAS'
const eqbAddress = 'n4UFVgvkdyKJbCnttHsJttUWmm9LcsKkgS'
const limit = 0

// BTC
fetch('https://api-qa-wallet.equibitgroup.com/proxycore?node=btc&method=getrawmempool')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Network response was not ok.')
  })
  .then(pool => {
    console.log('BTC mempool length: ', JSON.stringify(pool.result.length))
    if (pool.result.length > limit) {
      console.log('Mining...')
      fetch(`https://api-qa-wallet.equibitgroup.com/proxycore?node=btc&method=generatetoaddress&params[]=1&params[]=${btcAddress}`)
        .then(response => {
          return response.json()
        })
        .then(res => {
          console.log('BTC result: ', JSON.stringify(res))
        })
    }
  })
  .catch(error => {
    console.log('There was an error with the fetch: ', error.message)
  })

// EQB
fetch('https://api-qa-wallet.equibitgroup.com/proxycore?node=eqb&method=getrawmempool')
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Network response was not ok.')
  })
  .then(pool => {
    console.log('EQB mempool length: ', JSON.stringify(pool.result.length))
    if (pool.result.length > limit) {
      console.log('Mining...')
      fetch(`https://api-qa-wallet.equibitgroup.com/proxycore?node=eqb&method=generatetoaddress&params[]=1&params[]=${eqbAddress}`)
        .then(response => {
          return response.json()
        })
        .then(res => {
          console.log('EQB result: ', JSON.stringify(res))
        })
    }
  })
  .catch(error => {
    console.log('There was an error with the fetch: ', error.message)
  })
