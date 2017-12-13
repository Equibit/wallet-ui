
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
    htlcScript: '63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a91432603c646ac065369204cbfb4ab0839b18a18129670114b17576a914e88316256761f24413dab167e4c2e07a6b8f11ce6888ac'
  }
}
