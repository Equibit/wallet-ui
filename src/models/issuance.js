import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/list'
import feathersClient from '~/models/feathers-client'
import superModel from '~/models/super-model'
import algebra from '~/models/algebra'
import utils from './portfolio-utils'
const { fetchListunspent, importAddr, getUnspentOutputsForAmount } = utils

const Issuance = DefineMap.extend('Issuance', {
  _id: 'string',

  /**
   * Id of the user who created the issuance
   */
  userId: 'string',
  index: 'number',
  companyIndex: 'number',

  companyId: 'string',
  companyName: 'string',
  companySlug: 'string',
  domicile: 'string',
  issuanceName: 'string',
  issuanceType: 'string',
  get issuanceTypeDisplay () {
    return Issuance.typesMap[this.issuanceType] || this.issuanceType
  },
  issuanceUnit: 'string',   // ['SHARES', 'BTC', 'UNITS'] ?
  restriction: 'string',
  marketCap: 'number',
  change: 'number',
  changePercentage: 'number',

  // 24h stat data:
  highestBid: 'number',
  lowestAsk: 'number',
  highestNumShares: 'number',
  lowestNumShares: 'number',

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
      }
      return company
    }
  },
  keys: {
    serialize: false
  },
  address: {
    serialize: false,
    get () {
      return this.keys && this.keys.getAddress()
    }
  },
  // Array of UTXO from /listunspent
  utxo: {
    serialize: false
  },
  // The available amount in satoshi.
  availableAmount: {
    get () {
      return this.utxo && this.utxo.reduce((acc, {amount}) => (acc + amount), 0)
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
        address: company.streetAddress + ' ' + company.streetAddress2,
        city: company.city,
        state_or_province: company.state,
        zip_or_postal_code: company.postalCode,
        country: company.domicile,
        web: company.website,
        public_key_web: company.website,
        email: company.contactEmail,
        phone: company.phoneNumber
      },
      issuance: {
        issuance_public_key: this.address,
        issuance_name: this.issuanceName,
        issuance_date: Math.floor(Date.now() / 1000),
        restriction_level: (this.restriction || 0),
        security_type: this.issuanceType
      }
    }
  },
  getTxoutsFor (amount) {
    return getUnspentOutputsForAmount(this.utxo, amount)
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
  // Every new issuance requires a new index for its EQB address.
  getNewIndex () {
    return this.reduce((acc, issuance) => {
      if (issuance.index > acc) {
        acc = issuance.index
      }
      return acc
    }, 0)
  },
  addresses: {
    get () {
      return this.reduce((acc, issuance) => {
        if (issuance.keys && issuance.address && acc.indexOf(issuance.address) === -1) {
          // todo: import address on authorizing an issuance.
          importAddr(issuance.address, 'EQB')
          acc.push(issuance.address)
        }
        return acc
      }, [])
    }
  },
  loadUTXO () {
    if (this.addresses.length > 0) {
      fetchListunspent({EQB: this.addresses}).then(utxoByType => {
        if (utxoByType.EQB.total === 0) {
          return
        }
        const utxoByAddr = utxoByType.EQB.addresses
        this.forEach(issuance => {
          if (utxoByAddr[issuance.address]) {
            issuance.utxo = utxoByAddr[issuance.address].txouts.filter(out => {
              // todo: do a more comprehensive filtering.
              return out.equibit && out.equibit.issuance_json.search(issuance.issuanceName) !== -1
            })
          }
        })
      })
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
