
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

  offer.htlcTxId2 = 'e426a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301'

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
    htlcScript2: '63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a914f5db705e49316357b6b27087daa63c1ae2771f66675ab17576a91441ab400b12f9311d00ff9bb98423481c921a0edb6888ac',
    txHex: '010000000101e342ee9bf51d1b93e801a32d620368f3bc6fd68ed3ed5076f41e8716a926e2010000006b483045022100b75a7603b07a39acfb0bb3f5c8823e35b8db32b57b4876b7411c7d02489ff48202207f7124da9d8d0495a939b0677e6ff230b2f488bdd5511c1d8becb3cbf1e33227012103687b195326cc57e054a5b780d3fb3383b2e113a0082be4a22f600acdc276a564ffffffff02b8880000000000005a63a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a91432603c646ac065369204cbfb4ab0839b18a18129670114b17576a914e88316256761f24413dab167e4c2e07a6b8f11ce6888ace0099800000000001976a914a8d51b85759148bf787411b168b4eb380cc12bfd88ac00000000',
    txId: 'd9abf1331cfe7144c44bf1804dd8b2e45063aa6886bb44620235f3abb3e0f38c',
    txHex2: '020000000250ca92bfbf67976d7d3ba408f6481ca7e3666664ce32227b12877d539e757e4e000000006a4730440220018a9e80e7abdf883921e3238f81d011a6cbe508cc7c8d3d4f47ef9f99c5c8fd02206440cde916bad73b090f3c1a54c3e660c4185ee000f6af1408ecb9e5eaa91f6e012102ecddd56c4d3b695ce762ef51dcd2ce4f660396cc93c8e091477d220ba8b896060000000001e342ee9bf51d1b93e801a32d620368f3bc6fd68ed3ed5076f41e8716a926e4000000006a473044022011549ddd4337238a5de19461c51871b122fdbf06a3ea75ce3963320f15060c890220448270ef7bc086b59c80b16953681ea7d75d7e37b8fa564949a2d3eb202811d6012102f53adfa2754b5fa7066f4d013ff5d10ff7c24e3feb6f1e4f001e275236cd22970000000003f4010000000000005963a820169c59d82c28bbefc3ef6ae83b94c93ffa03d2c4bd2b9f6d33340fdd4fe27cd98876a914f5db705e49316357b6b27087daa63c1ae2771f66675ab17576a91441ab400b12f9311d00ff9bb98423481c921a0edb6888ac000000000050ca92bfbf67976d7d3ba408f6481ca7e3666664ce32227b12877d539e757e4e008ccff008000000001976a91441ab400b12f9311d00ff9bb98423481c921a0edb88ac000000000050ca92bfbf67976d7d3ba408f6481ca7e3666664ce32227b12877d539e757e4e0018eb1c0d000000001976a914a8d51b85759148bf787411b168b4eb380cc12bfd88ac000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    txId2: 'f684cb4138e05966f4462f4ffb37323da9d072347337f5fdbf98261d947da2ad'
  }
}
