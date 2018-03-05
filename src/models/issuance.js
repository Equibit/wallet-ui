/**
 * @module {can-map} models/issuance Issuance
 * @parent models
 *
 * Issuance record
 *
 * @group models/issuance.properties 0 properties
 */

import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
import { superModelNoCache as superModel } from './super-model'
import algebra from './algebra'
import Session from '~/models/session'
import Transaction from '~/models/transaction/transaction'
import { fetchListunspent, importMulti, getUnspentOutputsForAmount } from './portfolio-utils'

const Issuance = DefineMap.extend('Issuance', {
  _id: 'string',

  /**
   * @property {Number} models/issuance.properties.issuanceTxId issuanceTxId
   * @parent models/issuance.properties
   * Id of the authorization transaction
   */
  // Note: investor can authorize more shares of the issuance later, which will create a new `issuanceTxId`.
  // But `issuanceAddress` will always be the same.
  // todo: change this to array of txId when we implement the case for issuance gets authorized more than once.
  issuanceTxId: 'string',

  /**
   * @property {Number} models/issuance.properties.userId userId
   * @parent models/issuance.properties
   * Id of the user who created the issuance
   */
  userId: 'string',

  /**
   * Issuance address identifies issuance in Blockchain. All OrderBook items will be linked by this address.
   * This is to find UTXO of the issuance; do not confuse with authorization txid (issuanceTxId).
   */
  issuanceAddress: 'string',

  /**
   * For deriving keys
   * /m' /44' /79' /<company_index>' /<issuance_index>
   */
  index: 'number',
  companyIndex: 'number',

  /**
   * Company and Issuance info.
   */
  companyId: 'string',
  companyName: 'string',
  companySlug: {
    get () {
      return this.companyName && this.companyName.toLowerCase().split(' ').join('-')
    },
    set (val) {
      // ignore sets
    },
    serialize: true
  },
  domicile: 'string',
  issuanceName: 'string',
  issuanceType: 'string',
  get issuanceTypeDisplay () {
    return Issuance.typesMap[this.issuanceType] || this.issuanceType
  },
  issuanceUnit: 'string',   // ['SHARES', 'BTC', 'UNITS'] ?
  restriction: 'number',

  marketCap: 'number',
  change: 'number',
  changePercentage: 'number',

  // 24h stat data:
  highestBid: 'number',
  lowestAsk: 'number',
  highestNumShares: 'number',
  lowestNumShares: 'number',

  currentPricePerShare: {
    get () {
      // TODO: lookup current price
      return 1
    }
  },

  // meta data:
  volume24h: 'number',
  sharesAuthorized: 'number',
  sharesIssued: 'number',
  sharesDividend: 'number',
  sharesDividendYield: 'number',

  tradesNum: 'number',

  // todo: remove this due to `issuanceType`?
  // ENUM ('Common Shares' | '')
  type: 'string',

  // extras:
  selected: {
    type: 'boolean',
    serialize: false
  },
  // helper prop for selected item of the dropdown list of Issuance.types
  issuanceTypeItem: {
    type: '*',
    serialize: false,
    set (val) {
      if (val && val.type) {
        this.issuanceType = val.type
      }
      return val
    }
  },
  selectedCompany: {
    serialize: false,
    set (company) {
      if (company) {
        this.companyId = company._id
        this.companyIndex = company.index
        this.companyName = company.name
        this.companySlug = company.slug
        this.domicile = company.domicile
        this.index = (this.issuances && this.issuances.getNewIndex(this.companyId)) || 0
      }
      return company
    }
  },
  /**
   * HDNode (instance of `bitcoinjs-lib/src/hdnode.js` class).
   * Can be used by issuer who sends issuances.
   */
  keys: {
    serialize: false,
    get (lastSetVal) {
      // Two cases:
      // - user is the issuer: to generate keys we use issuance company index
      // - user is an investor: find utxo address in portfolio
      if (!lastSetVal && typeof this.index !== 'undefined') {
        if (Session && this.userId === Session.current.user._id) {
          const companyHdNode = Session.current.user && Session.current.user.generatePortfolioKeys(this.companyIndex).EQB
          return companyHdNode && companyHdNode.derive(this.index)
        } else {
          const portfolio = Session && Session.current.portfolios && Session.current.portfolios[0]
          const addr = portfolio && portfolio.findAddress(this.utxo[0].address)
          return addr && addr.keyPair && {keyPair: addr.keyPair}
        }
      } else {
        return lastSetVal
      }
    }
  },
  get address () {
    return this.keys && this.keys.getAddress()
  },

  // Array of related UTXO from /listunspent belonging to addresses controlled by the current user.
  // Also set in portfolio model as a list of utxo from portfolio.utxoSecurities, which are listunspent
  // results from EQB addresses controlled by current user, used in page-portfolio/equity-grid component.
  utxo: {
    serialize: false
  },

  // total number of shares issued to user as a buyer (or authorized
  // by user as issuer, depending on user's relation to the issuance)
  // NOTE: 1 company share = 1 utxo.amount = 1 EQB Satoshi
  utxoAmountTotal: {
    get () {
      return this.utxo && this.utxo.reduce((acc, {amount}) => (acc + amount), 0)
    }
  },

  // total cost in BTC Satoshi of all utxo at time of their purchase
  utxoCostTotal: {
    // TODO: need to also query transactions for each utxo where transaction.type === BUY
    // and transaction.txId = utxo.txid
    // need to also add a 'costPerShare' to transactions table
    get () {
      return this.utxo && this.utxo.reduce(
        (acc, {amount, costPerShare}) => (acc + amount * costPerShare),
        0
      )
    }
  },

  // total current value of the shares in BTC Satoshi
  utxoPriceTotal: {
    get () {
      return this.currentPricePerShare * this.utxoAmountTotal
    }
  },

  // total current value of the shares in BTC
  utxoBtcValueTotal: {
    get () {
      return this.currentPricePerShare * this.utxoAmountTotal / 100000000
    }
  },

  // total gains or losses in BTC Satoshi
  utxoProfitLossTotal: {
    get () {
      return this.utxoPriceTotal - this.utxoCostTotal
    }
  },

  cancel () {
    const portfolio = Session && Session.current && Session.current.portfolios && Session.current.portfolios[0]

    if (!this.utxo || !this.utxo.length) {
      console.log('utxo MISSING on issuance during cancel:', this)
      return Promise.reject(new Error('utxo missing from issuance'))
    }

    const txouts = []
    this.utxo.forEach(utxo => {
      const address = utxo.address
      const cancelByIssuer = this.userId === Session.current.user._id
      const keyInfo = cancelByIssuer ? this.keys : portfolio.findAddress(address)
      const keyPair = keyInfo.keyPair
      // Note: txouts contain one input which will be used for the fee as well.
      txouts.push({
        txid: utxo.txid,
        vout: utxo.vout,
        amount: utxo.amount,
        address,
        keyPair
      })
      console.log('cancelIssuance', this, utxo)
    })

    return portfolio.getNextAddress().then(({ EQB }) => {
      const toAddress = EQB
      const options = {
        // todo: calculate fee
        fee: 1000,
        type: 'CANCEL',
        currencyType: 'EQB',
        description: `Canceling  ${this.issuanceName} of ${this.companyName}`,
        issuance: {
          companyName: this.companyName,
          companySlug: this.companySlug,
          issuanceId: this._id,
          issuanceName: this.issuanceName,
          issuanceType: this.issuanceType,
          issuanceUnit: this.issuanceUnit
        }
      }
      const tx = Transaction.makeTransaction(this.utxoAmountTotal, toAddress, txouts, options)

      return tx.save(() => {
        portfolio.markAsUsed(toAddress, 'EQB', false)
      })
    })
  },

  // The available amount in EQB Satoshi. 1 company share = 1 utxo.amount = 1 EQB Satoshi
  // This is how many shares the issuer has available OR how many shares the buyer currently owns
  // ALIAS of utxoAmountTotal TODO: stop using this and remove it
  availableAmount: {
    get () {
      return this.utxoAmountTotal
    }
  },

  getJson () {
    const company = this.selectedCompany
    return {
      company: {
        registration_number: (company.registrationNumber || 'no-registration-number'),
        jurisdiction_country: company.domicile,
        jurisdiction_state_or_province: company.state,
        legal_name: company.name,
        public_key_web: company.website
        // address: company.streetAddress + ' ' + company.streetAddress2,
        // city: company.city,
        // state_or_province: company.state,
        // zip_or_postal_code: company.postalCode,
        // country: company.domicile,
        // web: company.website,
        // email: company.contactEmail,
        // phone: company.phoneNumber
      },
      issuance: {
        issuance_address: this.issuanceAddress,
        issuance_name: this.issuanceName,
        issuance_date: Math.floor(Date.now() / 1000),
        restriction_level: (this.restriction || 0),
        security_type: this.issuanceType
      }
    }
  },
  getTxoutsFor (amount) {
    if (!this.utxo) {
      console.error('No UTXO for the issue')
      throw new Error('The issuance does not have UTXO')
    }
    return getUnspentOutputsForAmount(this.utxo, amount)
  },
  init () {
    console.log(`Issuance.init args, this:`, arguments, this)
  }
})

// "common_shares", "fund_units", "partnership_units", "trust_units", "preferred_shares" or "bonds"
Issuance.typesMap = {
  'common_shares': 'Common Shares',
  'preferred_shares': 'Preferred Shares',
  'trust_units': 'Trust Units',
  'fund_units': 'Partnership Units',   // <<< TODO ??? check type/name
  'bonds': 'Bonds'
}
Issuance.types = new DefineList(
  Object.keys(Issuance.typesMap).map(type => ({ type, name: Issuance.typesMap[type] }))
)

Issuance.List = DefineList.extend('IssuanceList', {
  '#': Issuance,
  // Every new issuance requires a new index (for the given company) for its EQB address.
  getNewIndex (companyId) {
    const companyIssuances = this.filter(issuance => issuance.companyId === companyId)
    return companyIssuances.reduce((acc, issuance) => {
      if (issuance.index >= acc) {
        acc = issuance.index + 1
      }
      return acc
    }, 0)
  },
  importAddressesPromise: '*',
  // todo: revisit this: the prop issuance.address is pointing to the issue authorization transaction. Technically Issuance.List should load UTXO based on portfolio meta addresses info and issuances meta (company and issuance indexes) when current user is also an issuer.
  addresses: {
    get () {
      const importAddresses = []
      const ret = this.reduce((acc, issuance) => {
        if (issuance.keys && issuance.address && acc.indexOf(issuance.address) === -1) {
          // todo: import address on authorizing an issuance.
          importAddresses.push(issuance.address)
          acc.push(issuance.address)
        }
        return acc
      }, [])
      this.importAddressesPromise = importMulti(importAddresses, 'EQB', this.dedupeEQBImport)
      return ret
    }
  },

  dedupeEQBImport: {
    value: []
  },

  // UTXO are listed by address, but different issuances can be sitting on the same address
  // (the authorized issuances should not, instead they should sit on separate addresses `company_index/issuance_index`)
  // so just in case we check issuance_json and filter by issuanceName (should be a combination companyName + issuanceName).
  loadUTXO () {
    if (this.addresses.length > 0) {
      return fetchListunspent({EQB: this.addresses}).then(utxoByType => {
        if (utxoByType.EQB.summary.total === 0) {
          return
        }
        const utxoByAddr = utxoByType.EQB.addresses
        this.forEach(issuance => {
          if (utxoByAddr[issuance.address]) {
            issuance.utxo = utxoByAddr[issuance.address].txouts.filter(out => {
              // todo: do a more comprehensive filtering.
              const json = out.equibit && out.equibit.issuance_json
              // previously was json.search(). Search takes a regex, so characters like +, ., *, $, etc messed it up
              return (json && json.indexOf(issuance.issuanceName) !== -1) ||
                  // Case: authorized issuance was already sold and change was sent back to issuance address:
                  issuance.issuanceTxId === out.equibit.issuance_tx_id
            })
          }
        })
      })
    } else {
      return Promise.reject(new Error(`No addresses for the issuances ${this.length}. Cannot load UTXO`))
    }
  }
})

Issuance.connection = superModel({
  Map: Issuance,
  List: Issuance.List,
  feathersService: feathersClient.service('/issuances'),
  name: 'issuances',
  algebra
})

Issuance.algebra = algebra

export default Issuance
