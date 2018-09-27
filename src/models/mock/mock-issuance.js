import { bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto'
import Issuance from '../issuance'
import Session from '../session'
import cryptoUtils from '../../utils/crypto'
import './mock-session'
import hdNode, { network } from './mock-keys'
import feathersClient from '../feathers-client'
feathersClient.service('portfolios').patch = () => Promise.resolve()

const companyIndex = 1
const issuanceIndex = 0
const issuanceHdNode = hdNode.derivePath(`m/44'/73'/${companyIndex}'/0/${issuanceIndex}`)
const issuanceEcPair = bitcoin.ECPair.fromPrivateKey(issuanceHdNode.privateKey, { network })

console.log(`issuance address = ${cryptoUtils.getAddress(issuanceHdNode.publicKey, network)}`)

const amount = 150000000

const utxo = [{
  txid: '4e7e759e537d87127b2232ce646666e3a71c48f608a43b7d6d9767bfbf92ca50',
  vout: 0,
  address: 'mmWBNCAdwoPbF9BRBDeGo6QpoxrF98n7Rn',
  account: '',
  scriptPubKey: '76a9142d1161555a2e112ac5af4b1af64b7f4cd6c0021f88ac',
  amount: amount,
  confirmations: 0,
  spendable: false,
  solvable: false,
  equibit: {
    payment_currency: 0,
    payment_tx_id: '',
    issuance_tx_id: '0000000000000000000000000000000000000000000000000000000000000000',
    issuance_json: '{"company":{"registration_number":"no-registration-number","jurisdiction_country":"cc","jurisdiction_state_or_province":"f","legal_name":"comp","address":"12 h","city":"g","state_or_province":"f","zip_or_postal_code":"d","country":"cc","web":"s","public_key_web":"s","email":"f","phone":""},"issuance":{"issuance_public_key":"mmWBNCAdwoPbF9BRBDeGo6QpoxrF98n7Rn","issuance_name":"User 1 comp series one","issuance_date":1506631380,"restriction_level":0,"security_type":"common_shares"}}'
  }
}]

const issuance = new Issuance({
  _id: '595e5c58711b9e358f567edc',
  issuanceTxId: '4e7e759e537d87127b2232ce646666e3a71c48f608a43b7d6d9767bfbf92ca50',
  issuanceAddress: 'mmWBNCAdwoPbF9BRBDeGo6QpoxrF98n7Rn',
  companyIndex,
  index: issuanceIndex,
  companyName: 'Equibit Group',
  issuanceName: 'Series One',
  issuanceType: 'common_shares',
  keys: { node: issuanceHdNode, ecPair: issuanceEcPair },
  utxo,
  rates: Session.current.rates
})

console.log('MOCK issuance:::', issuance)
Session.current.issuancesPromise = Promise.resolve(new Issuance.List([issuance]))

export default issuance
export { amount }
