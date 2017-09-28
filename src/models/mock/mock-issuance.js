import Issuance from '../issuance'
import Session from '../session'
import './mock-session'
import hdNode from './mock-keys'
import feathersClient from '../feathers-client'
feathersClient.service('portfolios').patch = () => Promise.resolve()

const companyIndex = 1
const issuanceIndex = 0
const issuanceKeyPair = hdNode.derivePath(`m/44'/73'/${companyIndex}'/0/${issuanceIndex}`)

console.log(`issuance address = ${issuanceKeyPair.getAddress()}`)

const amount = 1.5

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
    issuance_json: '{"company":{"registration_number":"no-registration-number","jurisdiction_country":"cc","jurisdiction_state_or_province":"f","legal_name":"comp","address":"12 h","city":"g","state_or_province":"f","zip_or_postal_code":"d","country":"cc","web":"s","public_key_web":"s","email":"f","phone":""},"issuance":{"issuance_public_key":"025194773f4d9a3cd8ea9e017d634df99044ab8074ef8a06b583d6663fb08f5d68","issuance_name":"User 1 comp series one","issuance_date":1506631380,"restriction_level":0,"security_type":"common_shares"}}'
  }
}]

const issuance = new Issuance({
  _id: '595e5c58711b9e358f567edc',
  companyIndex,
  index: issuanceIndex,
  companyName: 'Equibit Group',
  issuanceName: 'Series One',
  keys: issuanceKeyPair,
  utxo,
  rates: Session.current.rates
})

export default issuance
export { amount }
