
import DefineMap from 'can-define/map/map'
import { Buffer } from '@equibit/wallet-crypto/dist/wallet-crypto'
import { createHtlcOffer } from '../../components/page-issuance-details/order-book/order-book'
import Order from '../order'
import Session from '../session'
import orderFixturesData from '../fixtures/orders'
import issuance from './mock-issuance'
import './mock-session'

const orderDataAsk = Object.assign({}, orderFixturesData[0], { issuance: issuance })
const orderAsk = new Order(orderDataAsk)
const formDataAsk = new (DefineMap.extend('OfferFormData', {seal: false}, {}))({
  order: orderAsk,
  quantity: 500
})

const orderDataBid = Object.assign({}, orderFixturesData[1], { issuance: issuance })
const orderBid = new Order(orderDataBid)
const formDataBid = new (DefineMap.extend('OfferFormData', {seal: false}, {}))({
  order: orderBid,
  quantity: 500
})

const secretHex = '7f270ed6627eb571afa18061eda973ba7fb76d5799c29ff2bfa46c23f91db30f'
const secret = Buffer.from(secretHex, 'hex')
const timelock = 20
const eqbAddress = 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo'
const refundBtcAddress = 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'
// const changeBtcAddressPair = { EQB: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', BTC: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ' }

// type :: Ask | Bid
export default function (type = 'Ask') {
  const offer = type === 'Ask'
    ? createHtlcOffer(orderAsk, secret, timelock, 'description', Session.current.user, issuance, {EQB: eqbAddress, BTC: refundBtcAddress})
    : createHtlcOffer(orderBid, secret, timelock, 'description', Session.current.user, issuance, {EQB: eqbAddress, BTC: refundBtcAddress})

  offer.quantity = 500
  offer.htlcTxId1 = 'e426a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301'
  offer.htlcTxId2 = 'e426a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301'
  offer.timelock2 = timelock / 2

  return {
    offer,
    order: orderAsk,
    orderBid,
    orderData: orderDataAsk,
    orderDataBid,
    formData: formDataAsk,
    formDataBid,
    secretHex,
    timelock,
    eqbAddress,
    refundBtcAddress,
    htlcScript: '63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a914e88316256761f24413dab167e4c2e07a6b8f11ce670114b17576a914e88316256761f24413dab167e4c2e07a6b8f11ce6888ac',
    htlcScript2: '63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a914f5db705e49316357b6b27087daa63c1ae2771f66675ab17576a91441ab400b12f9311d00ff9bb98423481c921a0edb6888ac',
    htlcScript2Btc: '63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a914e88316256761f24413dab167e4c2e07a6b8f11ce675ab17576a914a8d51b85759148bf787411b168b4eb380cc12bfd6888ac',
    htlcScript4: '',
    txHex: '010000000101e342ee9bf51d1b93e801a32d620368f3bc6fd68ed3ed5076f41e8716a926e2010000006b483045022100d41a34b389da085ac9bb10ebe84f238a54820a0f8578ca5fbc5e89b27c5d6c0a02205de6fa347953984c7fbc223548ee237bc0c915a79534fd74c137eb275f0bcc6d012103687b195326cc57e054a5b780d3fb3383b2e113a0082be4a22f600acdc276a564ffffffff02b8880000000000005a63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a914e88316256761f24413dab167e4c2e07a6b8f11ce670114b17576a914e88316256761f24413dab167e4c2e07a6b8f11ce6888ac74029800000000001976a914a8d51b85759148bf787411b168b4eb380cc12bfd88ac00000000',
    txId: '5fddc5744df1a44edd407d816082bef618f46593abe64359af1a1ea75210eafa',
    txHex2: '020000000250ca92bfbf67976d7d3ba408f6481ca7e3666664ce32227b12877d539e757e4e000000006a4730440220330cb466674e2fee2029de528c3ed479176c1beb6088fa567c143306ac92b7d202201fbf2c427a50b9e7d6cd9de2bc85b2b2c0c831ad70c66dbb0dc4df2e925616e7012102ecddd56c4d3b695ce762ef51dcd2ce4f660396cc93c8e091477d220ba8b896060000000001e342ee9bf51d1b93e801a32d620368f3bc6fd68ed3ed5076f41e8716a926e4000000006b483045022100f4df2cd1709eae2af9836af4c1f606b3ac182eccce3364f2fadf80d21adcc723022035bd09706313d6dd5f81c7545e5980f25a7e035cec5c30dbade8d6ba777b5602012102f53adfa2754b5fa7066f4d013ff5d10ff7c24e3feb6f1e4f001e275236cd22970000000003f4010000000000005963a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a914f5db705e49316357b6b27087daa63c1ae2771f66675ab17576a91441ab400b12f9311d00ff9bb98423481c921a0edb6888ac000000000050ca92bfbf67976d7d3ba408f6481ca7e3666664ce32227b12877d539e757e4e008ccff008000000001976a91441ab400b12f9311d00ff9bb98423481c921a0edb88ac000000000050ca92bfbf67976d7d3ba408f6481ca7e3666664ce32227b12877d539e757e4e0048e31c0d000000001976a914a8d51b85759148bf787411b168b4eb380cc12bfd88ac000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    txId2: 'd93f07e7149df76d07838acc141fd5d175b7b46c70712bf5ee15a42de7b9f532',
    txHex4: '010000000101e342ee9bf51d1b93e801a32d620368f3bc6fd68ed3ed5076f41e8716a926e4000000008c47304402207c7c1c3b5fdd24ab71ae4d1e24619eea0e90f29390fee4510ae38f3de373abce022071f3f53ce9b0c635af803f35e8200dace594b5b000d3a89acf24a5d5a9040e18012102bea71df2e079601e1f279cee848af0e07ff00180a47f58a66cefa5d94b1478c5207f270ed6627eb571afa18061eda973ba7fb76d5799c29ff2bfa46c23f91db30f51ffffffff01d0840000000000001976a914e88316256761f24413dab167e4c2e07a6b8f11ce88ac00000000',
    txId4: '27b5fee50fa1862dc0ac129d384ed7ed00f2d1cca257efad40d1bbe3d1bd2a21'
  }
}
