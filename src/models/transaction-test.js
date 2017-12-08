import assert from 'chai/chai'
import 'steal-mocha'
import DefineMap from 'can-define/map/map'
import { bitcoin, Buffer } from '@equibit/wallet-crypto/dist/wallet-crypto'
import cryptoUtils from '../utils/crypto'
import Order from './order'
import Session from './session'

import {
  buildTransaction,
  buildTransactionBtc,
  buildTransactionEqb,
  toSatoshi,
  makeTransaction,
  makeHtlc,
  createHtlcTx2
} from './transaction-utils'
import { createHtlcOffer, generateSecret } from '../components/page-issuance-details/order-book/order-book'

import './fixtures/portfolio'
import './fixtures/listunspent'
import './mock/mock-session'
import hdNode from './mock/mock-keys'
import issuance from './mock/mock-issuance'
import portfolio from './mock/mock-portfolio'
import orderFixturesData from './fixtures/orders'

describe('models/transaction-utils', function () {
  describe('buildTransaction', function () {
    const expectedHex = '0100000002b5a4d2ee7ada7a30722d3224c8e29443e75fc3506612ae41ee853f2fe24b6756000000006b483045022100c5d7e56232d2eff6461ea45bb8e9ffee36675598adb853bf6f61e881b2c29282022000d4f1d3c3e091daa4dbece16fb1f27ee199fdbd2db4db940b9a4b6987e24ed6012102c149f0b80bbbb0811cd7f2d8c2eed5bae28de5e992064590a0a16eb1743bc469ffffffff79ea8eea8ee96dc748304f5d85163d28bfcc0f9760ee50e02664b6b52dd9da1e000000006b483045022100861ac9755c989a65726a1dbf46bf85dcf12928fc5f4bc42fede7142af4111fd30220385336eed4e26c52c605a18a60effee88bfc9d0306b09994dd85bf48607762f50121028fe426abec4cd47b05911e18e91cd751a1646d179217380e7799cd12268bf202ffffffff0201000000000000001976a9143ed6bbf121b09f20b46381ab7dbf547e18ffbc3b88ac02000000000000001976a914af407ff486847db48b9a2cb25b6e14d3044eaf4488ac00000000'
    it('should create a transaction hex', function () {
      const inputA = hdNode.derive(0)
      const inputB = hdNode.derive(1)
      const inputs = [
        {txid: '56674be22f3f85ee41ae126650c35fe74394e2c824322d72307ada7aeed2a4b5', vout: 0, keyPair: inputA.keyPair},
        {txid: '1edad92db5b66426e050ee60970fccbf283d16855d4f3048c76de98eea8eea79', vout: 0, keyPair: inputB.keyPair}
      ]
      const outputs = [
        {address: 'mmFDRwLd2sNzqFHeoKJdrTdwMzVYiH4Hm6', value: 1},
        {address: 'mwVbp9hMyfvnjW3sEbyfgLqiGd4wMxbekh', value: 2}
      ]
      const transactionInfo = buildTransaction('BTC')(inputs, outputs, bitcoin.networks.testnet)
      assert.equal(transactionInfo.hex, expectedHex)
    })
  })
  describe.skip('buildTransactionBtc', function () {
    it('should work :)', function () {
      assert.ok(typeof buildTransactionBtc === 'function')
    })
  })
  describe.skip('buildTransactionEqb', function () {
    it('should work :)', function () {
      assert.ok(typeof buildTransactionEqb === 'function')
    })
  })
  describe.skip('toSatoshi', function () {
    it('should work :)', function () {
      assert.ok(typeof toSatoshi === 'function')
    })
  })
  describe.skip('makeTransaction', function () {
    it('should work :)', function () {
      assert.ok(typeof makeTransaction === 'function')
    })
  })
  describe('makeHtlc', function () {
    const secretHex = '720f97ce05d1b6afccabcfe7a7519ba48b48a16f657d077c825af7566bfc2a99'
    const secret = Buffer.from(secretHex, 'hex')
    const secretHash = cryptoUtils.sha256(secret).toString('hex')

    // Note: the expected values were created manually:
    const expectedTxHex = '0100000001b5a4d2ee7ada7a30722d3224c8e29443e75fc3506612ae41ee853f2fe24b6756000000006b483045022100daa76f50b528c615c501a1ec89e91ebfdea9229ebb3910457008fdfc7057fb6202200cf3742c8a4d85951027c7a9420fac3d970c62e6c2a083e5395009b607e47eb3012102c149f0b80bbbb0811cd7f2d8c2eed5bae28de5e992064590a0a16eb1743bc469ffffffff0280f0fa02000000005a63a82037b9f894d525cdb5b4d860bbdc95d4b1ea70d1794f4b77e6e54fdac374870a6d8876a91418c1f2fd53cf24b918470437e25639ed4325bd47670190b17576a914685101ea3d9f9ba1a1767bb7b0bfa8987067d2a36888acffe0f505000000001976a914751388becb32b332d716c7735ad51c9a40e9d87588ac00000000'
    const expectedTxId = '50a4d1c3fac0a9070963ff824cde4ccb7b9b68e24484454cef48788427c70452'

    const amount = 0.5 * 100000000
    const fromNode = hdNode.derive(0)
    const toAddressA = hdNode.derive(1).getAddress()
    const toAddressB = hdNode.derive(2).getAddress()
    const chageAddr = hdNode.derive(3).getAddress()
    const hashlock = secretHash
    const timelock = 144
    const txouts = [{
      txid: '56674be22f3f85ee41ae126650c35fe74394e2c824322d72307ada7aeed2a4b5',
      vout: 0,
      amount: 150000000,
      keyPair: fromNode.keyPair
    }]
    const options = {
      fee: 0.0001,
      changeAddr: chageAddr,
      type: '',
      currencyType: 'BTC',
      description: 'test btc htlc',
      changeAddrEmptyEqb: '',
      amountEqb: 0
    }
    const txData = makeHtlc(
      amount, toAddressA, toAddressB, hashlock, timelock, txouts,
      options
    )
    it('should create data for instantiating an HTLC Transaction', function () {
      assert.equal(typeof txData, 'object')
    })
    it('should contain amount', function () {
      assert.equal(txData.amount, amount)
    })
    it('should contain hashlock', function () {
      assert.equal(txData.hashlock.length, 64)
      assert.equal(txData.hashlock, secretHash)
    })
    it('should contain BTC transaction hex and id', function () {
      assert.equal(txData.hex, expectedTxHex)
      assert.equal(txData.txId, expectedTxId)
    })
  })

  describe.only('createHtlcTx2', function () {
    // todo: move this to mocks.
    const orderData = Object.assign({}, orderFixturesData[0], { issuance: issuance })
    const order = new Order(orderData)
    const formData = new (DefineMap.extend('OfferFormData', {seal: false}, {}))({
      order,
      quantity: 500
    })
    const secret = generateSecret()
    const timelock = 20
    const eqbAddress = 'n3vviwK6SMu5BDJHgj4z54TMUgfiLGCuoo'
    const refundBtcAddress = 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA'
    // const changeBtcAddressPair = { EQB: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', BTC: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ' }

    const htlcOffer = createHtlcOffer(formData, 'BUY', secret, timelock, Session.current.user, issuance, eqbAddress, refundBtcAddress)
    htlcOffer.htlcStep = 2

    const tx = createHtlcTx2(htlcOffer, order, portfolio, issuance)

    console.log('tx', tx)
    it('should set the correct type', function () {
      assert.equal(tx.type, 'BUY')
    })
    it('should set amount = quantity', function () {
      assert.equal(tx.amount, htlcOffer.quantity)
    })
    it('should set BTC transaction hex and id', function () {
      assert.ok(tx.hex)
      assert.ok(tx.txId)
      assert.ok(tx.currencyType, 'BTC')
    })
    it('should set issuance details', function () {
      assert.equal(tx.companyName, 'Equibit Group')
      assert.equal(tx.issuanceName, 'Series One')
    })
    it('should set fromAddress', function () {
      assert.ok(tx.fromAddress)
    })
    it('should set toAddress', function () {
      assert.equal(tx.toAddress, htlcOffer.eqbAddressTrading)
    })
    it('should set refundAddress', function () {
      assert.equal(tx.refundAddress, order.eqbAddressHolding)
    })
    it('should set timelock', function () {
      assert.equal(tx.timelock, Math.floor(htlcOffer.timelock / 2))
    })
    it('should set htlcStep', function () {
      assert.equal(tx.htlcStep, 2)
    })
  })
})
