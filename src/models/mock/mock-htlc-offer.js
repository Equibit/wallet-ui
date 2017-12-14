
import DefineMap from 'can-define/map/map'
import { Buffer } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { createHtlcOffer } from '../../components/page-issuance-details/order-book/order-book'
import Order from '../order'
import Session from '../session'
import orderFixturesData from '../fixtures/orders'
import issuance from './mock-issuance'
import './mock-session'

const orderData = Object.assign({}, orderFixturesData[0], { issuance: issuance })
const order = new Order(orderData)
const formData = new (DefineMap.extend('OfferFormData', {seal: false}, {}))({
  order,
  quantity: 500
})

const secretHex = '7f270ed6627eb571afa18061eda973ba7fb76d5799c29ff2bfa46c23f91db30f'
const secret = Buffer.from(secretHex, 'hex')
const timelock = 20
const eqbAddress = 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo'
const refundBtcAddress = 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'
// const changeBtcAddressPair = { EQB: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', BTC: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ' }

export default function () {
  const offer = createHtlcOffer(formData, 'BUY', secret, timelock, Session.current.user, issuance, eqbAddress, refundBtcAddress)
  return {
    offer,
    order,
    orderData,
    formData,
    secretHex,
    timelock,
    eqbAddress,
    refundBtcAddress,
    htlcScript: '63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a91432603c646ac065369204cbfb4ab0839b18a18129670114b17576a914e88316256761f24413dab167e4c2e07a6b8f11ce6888ac',
    htlcScript2: '63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a914f5db705e49316357b6b27087daa63c1ae2771f66675ab17576a91432603c646ac065369204cbfb4ab0839b18a181296888ac',
    txHex: '010000000101e342ee9bf51d1b93e801a32d620368f3bc6fd68ed3ed5076f41e8716a926e2010000006b483045022100b75a7603b07a39acfb0bb3f5c8823e35b8db32b57b4876b7411c7d02489ff48202207f7124da9d8d0495a939b0677e6ff230b2f488bdd5511c1d8becb3cbf1e33227012103687b195326cc57e054a5b780d3fb3383b2e113a0082be4a22f600acdc276a564ffffffff02b8880000000000005a63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a91432603c646ac065369204cbfb4ab0839b18a18129670114b17576a914e88316256761f24413dab167e4c2e07a6b8f11ce6888ace0099800000000001976a914a8d51b85759148bf787411b168b4eb380cc12bfd88ac00000000',
    txId: 'd9abf1331cfe7144c44bf1804dd8b2e45063aa6886bb44620235f3abb3e0f38c'
  }
}
