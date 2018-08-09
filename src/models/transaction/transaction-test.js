import assert from 'chai/chai'
import 'steal-mocha'
import { bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto'
import Transaction from './transaction'

// Fixtures:
import '../fixtures/portfolio'
import '../fixtures/listunspent'
import '../mock/mock-session'
import hdNode from '../mock/mock-keys'
import issuance from '../mock/mock-issuance'
import portfolio from '../mock/mock-portfolio'
import mockHtlcOffer from '../mock/mock-htlc-offer'

import {
  buildTransaction,
  buildTransactionOld
  // buildTransactionBtc,
  // buildTransactionEqb,
  // toSatoshi
} from './transaction-build'
// import { makeTransaction } from './transaction-make'
import { createHtlc1, prepareHtlcConfigBtc, prepareTxData } from './transaction-create-htlc1'
import { createHtlc2, prepareHtlcConfigEqb } from './transaction-create-htlc2'
import { createHtlc3, createHtlcRefund3, prepareHtlcConfig3, prepareHtlcRefundConfig3 } from './transaction-create-htlc3'
import { createHtlc4, prepareHtlcConfig4 } from './transaction-create-htlc4'
import { createTransfer } from './transaction-transfer'

const blockchainInfoBySymbol = {
  BTC: {network: bitcoin.networks.testnet},
  EQB: {network: bitcoin.networks.testnet, sha: 'SHA3_256'}
}

describe('models/transaction/utils', function () {
  const transactionFeeRates = { EQB: 5, BTC: 10 }
  describe('buildTransaction', function () {
    const expectedHex = '0100000002b5a4d2ee7ada7a30722d3224c8e29443e75fc3506612ae41ee853f2fe24b6756000000006b483045022100c5d7e56232d2eff6461ea45bb8e9ffee36675598adb853bf6f61e881b2c29282022000d4f1d3c3e091daa4dbece16fb1f27ee199fdbd2db4db940b9a4b6987e24ed6012102c149f0b80bbbb0811cd7f2d8c2eed5bae28de5e992064590a0a16eb1743bc469ffffffff79ea8eea8ee96dc748304f5d85163d28bfcc0f9760ee50e02664b6b52dd9da1e000000006b483045022100861ac9755c989a65726a1dbf46bf85dcf12928fc5f4bc42fede7142af4111fd30220385336eed4e26c52c605a18a60effee88bfc9d0306b09994dd85bf48607762f50121028fe426abec4cd47b05911e18e91cd751a1646d179217380e7799cd12268bf202ffffffff0201000000000000001976a9143ed6bbf121b09f20b46381ab7dbf547e18ffbc3b88ac02000000000000001976a914af407ff486847db48b9a2cb25b6e14d3044eaf4488ac00000000'
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
    it('should create a transaction hex (bitcoinjs-lib build)', function () {
      const transactionInfo = buildTransactionOld('BTC')(inputs, outputs, bitcoin.networks.testnet)
      assert.equal(transactionInfo.hex, expectedHex)
    })
    it('should create a transaction hex (tx-builder)', function () {
      const transactionInfo = buildTransaction('BTC')(inputs, outputs, blockchainInfoBySymbol.BTC)
      assert.equal(transactionInfo.hex, expectedHex)
    })
  })
  describe('HTLC-1 Lock payment into HTLC', function () {
    const changeAddrPair = { EQB: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', BTC: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ' }
    let htlcOfferMock, htlcConfig
    describe('prepareHtlcConfigBtc', function () {
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        htlcConfig = prepareHtlcConfigBtc(htlcOfferMock.offer, htlcOfferMock.order, portfolio, changeAddrPair.BTC, 2900)
      })
      it('should create buildConfig', function () {
        const amount = htlcOfferMock.offer.quantity * htlcOfferMock.orderData.price
        const buildConfig = htlcConfig.buildConfig
        assert.equal(buildConfig.vin.length, 1, 'one vin')
        assert.equal(buildConfig.vin[0].txid, 'e226a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301', 'txid')
        assert.equal(buildConfig.vin[0].vout, 1, 'vin.0.vout')
        assert.ok(buildConfig.vin[0].keyPair, 'keyPair')
        assert.equal(buildConfig.vout[0].value, amount, 'amount of 35000')
        assert.equal(buildConfig.vout[0].scriptPubKey.toString('hex'), htlcOfferMock.htlcScript, 'scriptPubKey')
        assert.equal(buildConfig.vout[1].value, 10000000 - amount - 2900, 'change amount of 9962000')
        assert.equal(buildConfig.vout[1].address, changeAddrPair.BTC, 'change address')
      })
      it('should create txInfo object', function () {
        const txInfo = htlcConfig.txInfo
        assert.equal(txInfo.fromAddress, 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', 'address')
        assert.equal(txInfo.addressTxid, 'e226a916871ef47650edd38ed66fbcf36803622da301e8931b1df59bee42e301', 'vin.0.txid')
        assert.equal(txInfo.addressVout, '1', 'vin.0.vout')
        assert.equal(txInfo.amount, 35000, 'amount')
        assert.equal(txInfo.currencyType, 'BTC', 'currencyType')
        assert.equal(txInfo.fee, 2900, 'fee')
        assert.equal(txInfo.fromAddress, 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', 'fromAddress')
        assert.equal(txInfo.toAddress, 'n2iN6cGkFEctaS3uiQf57xmiidA72S7QdA', 'toAddress')
        assert.equal(txInfo.type, 'TRADE', 'type')
      })
    })

    describe('buildTransaction htlc', function () {
      let tx
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        htlcConfig = prepareHtlcConfigBtc(htlcOfferMock.offer, htlcOfferMock.order, portfolio, changeAddrPair.BTC, 2900)
        tx = buildTransaction('BTC')(htlcConfig.buildConfig.vin, htlcConfig.buildConfig.vout, blockchainInfoBySymbol.BTC)
      })
      it('should return tx hex', function () {
        assert.equal(tx.hex, htlcOfferMock.txHex)
      })
      it('should return txid', function () {
        assert.equal(tx.txId, htlcOfferMock.txId)
      })
    })

    describe('prepareTxData', function () {
      let txData, tx
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        htlcConfig = prepareHtlcConfigBtc(htlcOfferMock.offer, htlcOfferMock.order, portfolio, changeAddrPair.BTC, transactionFeeRates.BTC)
        tx = { hex: htlcOfferMock.txHex, txId: htlcOfferMock.txId }
        txData = prepareTxData(htlcConfig, tx, issuance)
      })
      it('should define htlc props', function () {
        assert.equal(txData.hashlock, htlcOfferMock.offer.hashlock, 'hashlock')
        assert.equal(txData.timelock, htlcOfferMock.offer.timelock, 'timelock')
      })
      it('should define tx props', function () {
        assert.equal(txData.hex, tx.hex, 'tx hex')
        assert.equal(txData.txId, tx.txId, 'txId')
      })
      it('should define issuance props', function () {
        assert.equal(txData.issuanceId, issuance._id, 'issuanceId')
        assert.equal(txData.issuanceName, issuance.issuanceName, 'issuanceName')
        assert.equal(txData.issuanceType, issuance.issuanceType, 'issuanceType')
        assert.equal(txData.issuanceUnit, issuance.issuanceUnit, 'issuanceUnit')
        assert.equal(txData.companyName, issuance.companyName, 'companyName')
        assert.equal(txData.companySlug, issuance.companySlug, 'companySlug')
      })
    })
    describe('createHtlc1', function () {
      let txData, tx
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        tx = { hex: htlcOfferMock.txHex, txId: htlcOfferMock.txId }
        txData = createHtlc1(blockchainInfoBySymbol, htlcOfferMock.offer, htlcOfferMock.order, portfolio, issuance, changeAddrPair.BTC, transactionFeeRates)
      })
      it('should define main props', function () {
        assert.equal(txData.amount, 35000, 'amount')
        assert.equal(txData.issuanceId, issuance._id, 'issuanceId')
      })
      it('should define hashlock', function () {
        assert.equal(txData.hashlock.length, 64)
        assert.equal(txData.hashlock, htlcOfferMock.offer.hashlock)
      })
      it('should define htlc1 transaction hex', function () {
        assert.equal(txData.hex, tx.hex, 'tx hex')
      })
      it('should define htlc1 transaction id', function () {
        assert.equal(txData.txId, tx.txId, 'txId')
      })
    })
  })

  describe('HTLC-2 Lock securities into HTLC', function () {
    const changeAddrPair = { EQB: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', BTC: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ' }
    let htlcOfferMock, htlcConfig

    describe('prepareHtlcConfigEqb', function () {
      describe('buildConfig', function () {
        let amount, order, buildConfig
        before(function () {
          htlcOfferMock = mockHtlcOffer()
          htlcConfig = prepareHtlcConfigEqb(htlcOfferMock.offer, htlcOfferMock.order, portfolio, issuance, changeAddrPair.EQB)
          amount = htlcOfferMock.offer.quantity
          order = htlcOfferMock.order
          buildConfig = htlcConfig.buildConfig
        })
        it('should have two vin for issuance and blank EQB', function () {
          assert.equal(buildConfig.vin.length, 2, 'two vins')
        })
        it('should have correct issuance inputs', function () {
          assert.equal(buildConfig.vin[0].txid, issuance.utxo[0].txid, 'issuance txid')
          assert.equal(buildConfig.vin[0].vout, issuance.utxo[0].vout, 'vin.0.vout')
          assert.ok(buildConfig.vin[0].keyPair, 'keyPair')
        })
        it('should have correct blank EQB inputs', function () {
          const utxo = portfolio.utxoByTypeByAddress.EQB.addresses.mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU.txouts
          assert.equal(buildConfig.vin[1].txid, utxo[0].txid, 'txid blank EQB')
          assert.equal(buildConfig.vin[1].vout, utxo[0].vout, 'vin.1.vout blank EQB')
          assert.ok(buildConfig.vin[1].keyPair, 'keyPair blank EQB')
        })
        it('should have 3 outputs', function () {
          assert.equal(buildConfig.vout.length, 3, 'three vouts')
        })
        it('should have correct issuance output (amount, script and issuance txid)', function () {
          assert.equal(buildConfig.vout[0].value, amount, 'amount of 500')
          assert.equal(buildConfig.vout[0].scriptPubKey.toString('hex'), htlcOfferMock.htlcScript2, 'scriptPubKey')
          assert.equal(buildConfig.vout[0].issuanceTxId, '4e7e759e537d87127b2232ce646666e3a71c48f608a43b7d6d9767bfbf92ca50', 'txid of the authorization transaction')
        })
        it('should have correct issuance change output', function () {
          assert.equal(buildConfig.vout[1].value, issuance.utxo[0].amount - amount, 'change for securities of 149999500')
          assert.equal(buildConfig.vout[1].address, order.eqbAddress, 'change address for securities (eqbAddress)')
        })
        it('should have correct blank EQB change output', function () {
          const utxo = portfolio.utxoByTypeByAddress.EQB.addresses.mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU.txouts
          assert.equal(buildConfig.vout[2].value, utxo[0].amount - 3000, 'change amount blank EQB of 219999000')
          assert.equal(buildConfig.vout[2].address, changeAddrPair.EQB, 'change address for blank EQB')
        })
      })

      describe('txInfo', function () {
        let txInfo, amount, order, offer, buildConfig
        before(function () {
          htlcOfferMock = mockHtlcOffer()
          htlcConfig = prepareHtlcConfigEqb(htlcOfferMock.offer, htlcOfferMock.order, portfolio, issuance, changeAddrPair.EQB)
          amount = htlcOfferMock.offer.quantity
          order = htlcOfferMock.order
          offer = htlcOfferMock.offer
          buildConfig = htlcConfig.buildConfig
          txInfo = htlcConfig.txInfo
        })
        it('should have main address info', function () {
          assert.equal(txInfo.addressTxid, buildConfig.vin[0].txid, 'addressTxid = vin.0.txid')
          assert.equal(txInfo.addressVout, buildConfig.vin[0].vout, 'addressVout = vin.0.vout')
        })
        it('should have amount, types and desc', function () {
          assert.equal(txInfo.amount, amount, 'amount of 500')
          assert.equal(txInfo.currencyType, 'EQB', 'currencyType')
          assert.equal(txInfo.type, 'TRADE', 'type')
        })
        it('should have fee and from/to addresses', function () {
          assert.equal(txInfo.fee, 3000, 'fee')
          assert.equal(txInfo.fromAddress, order.eqbAddress, 'fromAddress = order.eqbAddress')
          assert.equal(txInfo.toAddress, offer.eqbAddress, 'toAddress = offer.eqbAddress')
        })
      })
    })
    describe('createHtlc2', function () {
      let txData, tx
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        tx = { hex: htlcOfferMock.txHex2, txId: htlcOfferMock.txId2 }
        txData = createHtlc2(blockchainInfoBySymbol, htlcOfferMock.offer, htlcOfferMock.order, portfolio, issuance, changeAddrPair.EQB, transactionFeeRates)
      })
      it('should define main props', function () {
        assert.equal(txData.amount, 500, 'amount')
        assert.equal(txData.fee, 2920, 'fee')
        assert.equal(txData.issuanceId, issuance._id, 'issuanceId')
      })
      it('should define hashlock', function () {
        assert.equal(txData.hashlock.length, 64)
        assert.equal(txData.hashlock, htlcOfferMock.offer.hashlock)
      })
      it('should define htlc2 transaction hex', function () {
        assert.equal(txData.hex, tx.hex, 'tx hex')
      })
      it('should define htlc2 transaction id', function () {
        assert.equal(txData.txId, tx.txId, 'txId')
      })
    })
  })

  describe('HTLC-3 Collect securities (for the Sell order / Buy offer)', function () {
    const changeAddrPair = { EQB: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', BTC: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ' }
    let htlcOfferMock, htlcConfig
    // The createHTLC3 (+ refund, + blank EQB) child suites may need a little extra time to run the setups.
    //  The default 2000ms timeout often fails, so here
    //  the timeout is set to 5000ms instead.  Future changes may
    //  require this timeout to grow even more.  Note that this change
    this.timeout(10000)
    describe('prepareHtlcConfig3', function () {
      describe('buildConfig', function () {
        let amount, order, offer, buildConfig
        before(function () {
          htlcOfferMock = mockHtlcOffer()
          amount = htlcOfferMock.offer.quantity
          order = htlcOfferMock.order
          offer = htlcOfferMock.offer
          htlcConfig = prepareHtlcConfig3(order, offer, portfolio, issuance, offer.secretHex, changeAddrPair.EQB)
          buildConfig = htlcConfig.buildConfig
        })
        it('should have two vin for issuance and blank EQB fee', function () {
          assert.equal(buildConfig.vin.length, 2, 'two vins')
        })
        it('should have two vout for issuance and blank EQB fee change', function () {
          assert.equal(buildConfig.vout.length, 2, 'two vins')
        })
        it('should have correct issuance inputs', function () {
          assert.equal(buildConfig.vin[0].txid, htlcOfferMock.offer.htlcTxId2, 'vin.0.txid === offer.htlcTxId2')
          assert.equal(buildConfig.vin[0].vout, 0, 'vin.0.vout')
          assert.ok(buildConfig.vin[0].keyPair, 'keyPair')
        })
        it('should have correct blank EQB inputs', function () {
          const utxo = portfolio.utxoByTypeByAddress.EQB.addresses.mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU.txouts
          assert.equal(buildConfig.vin[1].txid, utxo[0].txid, 'txid blank EQB')
          assert.equal(buildConfig.vin[1].vout, utxo[0].vout, 'vin.1.vout blank EQB')
          assert.ok(buildConfig.vin[1].keyPair, 'keyPair blank EQB')
        })
        it.skip('should have correct issuance output (amount, script and issuance txid)', function () {
          assert.equal(buildConfig.vout[0].value, amount, 'amount of 500')
          assert.equal(buildConfig.vout[0].scriptPubKey.toString('hex'), htlcOfferMock.htlcScript2, 'scriptPubKey')
          assert.equal(buildConfig.vout[0].issuanceTxId, '4e7e759e537d87127b2232ce646666e3a71c48f608a43b7d6d9767bfbf92ca50', 'txid of the authorization transaction')
        })
        it.skip('should have correct issuance change output', function () {
          assert.equal(buildConfig.vout[1].value, issuance.utxo[0].amount - amount, 'change for securities of 149999500')
          assert.equal(buildConfig.vout[1].address, order.eqbAddress, 'change address for securities (eqbAddress)')
        })
        it.skip('should have correct blank EQB  change output', function () {
          const utxo = portfolio.utxoByTypeByAddress.EQB.addresses.mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU.txouts
          assert.equal(buildConfig.vout[2].value, utxo[0].amount - 3000, 'change amount blank EQB of 219999000')
          assert.equal(buildConfig.vout[2].address, changeAddrPair.EQB, 'change address for blank EQB')
        })
      })

      describe('txInfo', function () {
        let txInfo, amount, order, offer, buildConfig
        before(function () {
          htlcOfferMock = mockHtlcOffer()
          amount = htlcOfferMock.offer.quantity
          order = htlcOfferMock.order
          offer = htlcOfferMock.offer
          htlcConfig = prepareHtlcConfig3(order, offer, portfolio, issuance, offer.secretHex, changeAddrPair.EQB)
          buildConfig = htlcConfig.buildConfig
          txInfo = htlcConfig.txInfo
        })
        it('should have main address info', function () {
          assert.equal(txInfo.addressTxid, buildConfig.vin[0].txid, 'addressTxid = vin.0.txid')
          assert.equal(txInfo.addressVout, buildConfig.vin[0].vout, 'addressVout = vin.0.vout')
        })
        it('should have amount, types and desc', function () {
          assert.equal(txInfo.amount, amount, 'amount of 500')
          assert.equal(txInfo.currencyType, 'EQB', 'currencyType')
          assert.equal(txInfo.type, 'TRADE', 'type')
          assert.equal(txInfo.description, 'Collecting securities from HTLC (step #3)')
        })
        it('should have fee and from/to addresses', function () {
          assert.equal(txInfo.fee, 3000, 'fee')
          assert.equal(txInfo.fromAddress, order.eqbAddress, 'fromAddress = order.eqbAddress')
          assert.equal(txInfo.toAddress, offer.eqbAddress, 'toAddress = offer.eqbAddress')
        })
      })
    })

    describe('createHtlc3', function () {
      let txData, tx
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        tx = { hex: htlcOfferMock.txHex3, txId: htlcOfferMock.txId3 }
        txData = createHtlc3(
          blockchainInfoBySymbol,
          htlcOfferMock.order, htlcOfferMock.offer, portfolio, issuance,
          htlcOfferMock.secretHex, changeAddrPair.EQB, transactionFeeRates
        )
      })
      it('should define main props', function () {
        assert.equal(txData.amount, 500, 'amount')
        assert.equal(txData.issuanceId, issuance._id, 'issuanceId')
      })
      it('should calculate fee correctly based on tx hex size', function () {
        assert.equal(txData.fee, 2575, 'fee')
      })
      // it('should define hashlock', function () {
      //   assert.equal(txData.hashlock.length, 64)
      //   assert.equal(txData.hashlock, htlcOfferMock.offer.hashlock)
      // })
      it('should define htlc3 transaction hex', function () {
        assert.equal(txData.hex, tx.hex, 'tx hex')
      })
      it('should define htlc3 transaction id', function () {
        assert.equal(txData.txId, tx.txId, 'txId')
      })
    })
    describe('createHtlcRefund3', function () {
      let txData, tx
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        tx = { hex: htlcOfferMock.txHex2, txId: htlcOfferMock.txId2 }
        txData = createHtlcRefund3(
          blockchainInfoBySymbol,
          htlcOfferMock.order, htlcOfferMock.offer, portfolio, issuance,
          htlcOfferMock.secretHex, changeAddrPair.EQB, transactionFeeRates
        )
      })
      it('should define main props', function () {
        assert.equal(txData.amount, 500, 'amount')
        assert.equal(txData.issuanceId, issuance._id, 'issuanceId')
      })
      it('should calculate fee correctly based on tx hex size', function () {
        assert.equal(txData.fee, 2405, 'fee')
      })
      it.skip('should define hashlock', function () {
        assert.equal(txData.hashlock.length, 64)
        assert.equal(txData.hashlock, htlcOfferMock.offer.hashlock)
      })
      it.skip('should define htlc3 transaction hex', function () {
        assert.equal(txData.hex, tx.hex, 'tx hex')
      })
      it.skip('should define htlc3 transaction id', function () {
        assert.equal(txData.txId, tx.txId, 'txId')
      })
    })

    describe('createHtlc3 for Blank EQB', function () {
      let txData, tx
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        tx = { hex: htlcOfferMock.txHexBlankEqb, txId: htlcOfferMock.txIdBlankEqb }
        txData = createHtlc3(
          blockchainInfoBySymbol,
          htlcOfferMock.orderBlankEqb, htlcOfferMock.offer, portfolio, null,
          htlcOfferMock.secretHex, changeAddrPair.EQB, transactionFeeRates
        )
      })
      it('should define amount', function () {
        assert.equal(txData.amount, 500)
      })
      it('should define assetType', function () {
        assert.equal(txData.assetType, 'EQUIBIT')
      })
      it('should calculate fee (for amount smaller than regular fee)', function () {
        assert.equal(txData.fee, 1)
      })
      it('should define htlc3 transaction hex', function () {
        assert.equal(txData.hex, tx.hex)
      })
      it('should define htlc3 transaction id', function () {
        assert.equal(txData.txId, tx.txId)
      })
    })

    describe('prepareHtlcRefundConfig3', function () {
      describe('buildConfig', function () {
        let amount, order, offer, buildConfig
        before(function () {
          htlcOfferMock = mockHtlcOffer()
          amount = htlcOfferMock.offer.quantity
          order = htlcOfferMock.order
          offer = htlcOfferMock.offer
          htlcConfig = prepareHtlcRefundConfig3(order, offer, portfolio, issuance, offer.secretHex, changeAddrPair.EQB)
          buildConfig = htlcConfig.buildConfig
        })
        it('should have two vin for issuance and blank EQB fee', function () {
          assert.equal(buildConfig.vin.length, 2, 'two vins')
        })
        it('should have two vout for refund and blank EQB fee change', function () {
          assert.equal(buildConfig.vout.length, 2, 'two vins')
          assert.equal(buildConfig.vout[0].address, order.eqbAddress, 'addressed to order holder (refund)')
        })
        it('should have correct issuance inputs', function () {
          assert.equal(buildConfig.vin[0].txid, htlcOfferMock.offer.htlcTxId2, 'vin.0.txid === offer.htlcTxId2')
          assert.equal(buildConfig.vin[0].vout, 0, 'vin.0.vout')
          assert.ok(buildConfig.vin[0].keyPair, 'keyPair')
        })
        it('should have correct blank EQB inputs', function () {
          const utxo = portfolio.utxoByTypeByAddress.EQB.addresses.mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU.txouts
          assert.equal(buildConfig.vin[1].txid, utxo[0].txid, 'txid blank EQB')
          assert.equal(buildConfig.vin[1].vout, utxo[0].vout, 'vin.1.vout blank EQB')
          assert.ok(buildConfig.vin[1].keyPair, 'keyPair blank EQB')
        })
        it.skip('should have correct issuance output (amount, script and issuance txid)', function () {
          assert.equal(buildConfig.vout[0].value, amount, 'amount of 500')
          assert.equal(buildConfig.vout[0].scriptPubKey.toString('hex'), htlcOfferMock.htlcScript2, 'scriptPubKey')
          assert.equal(buildConfig.vout[0].issuanceTxId, '4e7e759e537d87127b2232ce646666e3a71c48f608a43b7d6d9767bfbf92ca50', 'txid of the authorization transaction')
        })
        it.skip('should have correct issuance change output', function () {
          assert.equal(buildConfig.vout[1].value, issuance.utxo[0].amount - amount, 'change for securities of 149999500')
          assert.equal(buildConfig.vout[1].address, order.eqbAddress, 'change address for securities (eqbAddress)')
        })
        it.skip('should have correct blank EQB  change output', function () {
          const utxo = portfolio.utxoByTypeByAddress.EQB.addresses.mjVjVPi7j8CJvqCUzzjigbbqn4GYF7hxMU.txouts
          assert.equal(buildConfig.vout[2].value, utxo[0].amount - 3000, 'change amount blank EQB of 219999000')
          assert.equal(buildConfig.vout[2].address, changeAddrPair.EQB, 'change address for blank EQB')
        })
      })

      describe('txInfo', function () {
        let txInfo, amount, order, offer, buildConfig
        before(function () {
          htlcOfferMock = mockHtlcOffer()
          amount = htlcOfferMock.offer.quantity
          order = htlcOfferMock.order
          offer = htlcOfferMock.offer
          htlcConfig = prepareHtlcRefundConfig3(order, offer, portfolio, issuance, offer.secretHex, changeAddrPair.EQB)
          buildConfig = htlcConfig.buildConfig
          txInfo = htlcConfig.txInfo
        })
        it('should have main address info', function () {
          assert.equal(txInfo.addressTxid, buildConfig.vin[0].txid, 'addressTxid = vin.0.txid')
          assert.equal(txInfo.addressVout, buildConfig.vin[0].vout, 'addressVout = vin.0.vout')
        })
        it('should have amount, types and desc', function () {
          assert.equal(txInfo.amount, amount, 'amount of 500')
          assert.equal(txInfo.currencyType, 'EQB', 'currencyType')
          assert.equal(txInfo.type, 'REFUND', 'type')
          assert.equal(txInfo.description, 'Refunding securities from HTLC (step #3)')
        })
        it('should have fee and from/to addresses', function () {
          assert.equal(txInfo.fee, 3000, 'fee')
          assert.equal(txInfo.fromAddress, offer.eqbAddress, 'fromAddress = offer.eqbAddress')
          assert.equal(txInfo.toAddress, order.eqbAddress, 'toAddress = order.eqbAddress')
        })
      })
    })
  })

  describe('HTLC-4 Collect payment (for the Sell order / Buy offer)', function () {
    // const changeAddrPair = { EQB: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ', BTC: 'mvuf7FVBox77vNEYxxNUvvKsrm2Mq5BtZZ' }
    let htlcOfferMock, htlcConfig
    const fee = 3000

    describe('prepareHtlcConfig4', function () {
      describe('buildConfig', function () {
        let amount, order, offer, buildConfig
        before(function () {
          htlcOfferMock = mockHtlcOffer()
          order = htlcOfferMock.order
          offer = htlcOfferMock.offer
          amount = offer.quantity * offer.price
          htlcConfig = prepareHtlcConfig4(order, offer, portfolio, htlcOfferMock.secretHex)
          buildConfig = htlcConfig.buildConfig
        })
        it('should have one vin of BTC payment', function () {
          assert.equal(buildConfig.vin.length, 1, 'one vin')
        })
        it('should have one vout ', function () {
          assert.equal(buildConfig.vout.length, 1, 'one vout')
        })
        it('should have correct input', function () {
          assert.equal(buildConfig.vin[0].txid, htlcOfferMock.offer.htlcTxId1, 'vin.0.txid === offer.htlcTxId1')
          assert.equal(buildConfig.vin[0].vout, 0, 'vin.0.vout')
          assert.ok(buildConfig.vin[0].keyPair, 'keyPair')
        })
        it('should have correct input htlc', function () {
          assert.equal(buildConfig.vin[0].htlc.secret, htlcOfferMock.secretHex, 'secret')
          assert.equal(buildConfig.vin[0].htlc.refundAddr, offer.btcAddress, 'refundAddr')
          assert.equal(buildConfig.vin[0].htlc.timelock, offer.timelock, 'timelock')
        })
        it('should have correct output amount', function () {
          assert.equal(buildConfig.vout[0].value, amount - fee, 'amount - fee')
        })
        it('should have correct output address', function () {
          // todo: this should be a different address (next available for BTC)
          assert.equal(buildConfig.vout[0].address, order.btcAddress, 'output address')
        })
      })

      describe('txInfo', function () {
        let txInfo, amount, order, offer, buildConfig
        before(function () {
          htlcOfferMock = mockHtlcOffer()
          order = htlcOfferMock.order
          offer = htlcOfferMock.offer
          amount = offer.quantity * offer.price
          htlcConfig = prepareHtlcConfig4(order, offer, portfolio, htlcOfferMock.secretHex)
          buildConfig = htlcConfig.buildConfig
          txInfo = htlcConfig.txInfo
        })
        it('should have main address info', function () {
          assert.equal(txInfo.addressTxid, buildConfig.vin[0].txid, 'addressTxid = vin.0.txid')
          assert.equal(txInfo.addressVout, buildConfig.vin[0].vout, 'addressVout = vin.0.vout')
        })
        it('should have amount, types and desc', function () {
          assert.equal(txInfo.amount, amount - fee, 'amount minus fee')
          assert.equal(txInfo.currencyType, 'BTC', 'currencyType')
          assert.equal(txInfo.type, 'TRADE', 'type')
          assert.equal(txInfo.description, 'Collecting payment from HTLC (step #4)')
        })
        it('should have fee and from/to addresses', function () {
          assert.equal(txInfo.fee, 3000, 'fee')
          assert.equal(txInfo.fromAddress, offer.btcAddress, 'fromAddress = offer.btcAddress')
          assert.equal(txInfo.toAddress, order.btcAddress, 'toAddress = order.btcAddress')
        })
      })
    })

    describe('createHtlc4', function () {
      const fee = 2250
      let txData, tx, amount, order, offer
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        order = htlcOfferMock.order
        offer = htlcOfferMock.offer
        amount = offer.quantity * offer.price
        tx = { hex: htlcOfferMock.txHex4, txId: htlcOfferMock.txId4 }
        txData = createHtlc4(
          blockchainInfoBySymbol,
          order, offer, portfolio, issuance,
          htlcOfferMock.secretHex, null, transactionFeeRates
        )
      })
      it('should define main props', function () {
        assert.equal(txData.amount, amount - fee, 'amount minus fee')
        assert.equal(txData.fee, fee, 'fee')
      })
      it('should define transaction hex and id', function () {
        assert.equal(txData.hex, tx.hex, 'tx hex')
        assert.equal(txData.txId, tx.txId, 'txId')
      })
    })

    describe('createHtlc4 for Blank EQB', function () {
      const fee = 2250
      let txData, amount, order, offer
      before(function () {
        htlcOfferMock = mockHtlcOffer()
        order = htlcOfferMock.orderBlankEqb
        offer = htlcOfferMock.offer
        amount = offer.quantity * offer.price
        txData = createHtlc4(
          blockchainInfoBySymbol,
          order, offer, portfolio, null,
          htlcOfferMock.secretHex, null, transactionFeeRates
        )
      })
      it.skip('should define amount', function () {
        assert.equal(txData.amount, 32750)
        assert.equal(txData.amount, amount - fee)
      })
      it('should define assetType', function () {
        assert.equal(txData.assetType, 'EQUIBIT')
      })
      it.skip('should calculate fee correctly based on tx hex size', function () {
        assert.equal(txData.fee, 2250)
        assert.equal(txData.fee, fee)
      })
    })

    describe('create a transfer tx', function () {
      let txData, amount, toAddress, changeAddr, expectedTxId
      describe('for ISSUANCE', function () {
        before(function () {
          amount = 1000
          toAddress = 'mmFDRwLd2sNzqFHeoKJdrTdwMzVYiH4Hm6'
          changeAddr = 'mwVbp9hMyfvnjW3sEbyfgLqiGd4wMxbekh'
          txData = createTransfer(blockchainInfoBySymbol, 'ISSUANCE', amount, toAddress, changeAddr, portfolio, issuance, transactionFeeRates)
          expectedTxId = '9ec8649d893229d9407034f77f5b52ff8505bf887c2807eed8b95ea7e1295d94'
        })
        it('should define amount', function () {
          assert.equal(txData.amount, amount)
        })
        it('should define assetType', function () {
          assert.equal(txData.assetType, 'ISSUANCE')
        })
        it('should define currencyType', function () {
          assert.equal(txData.currencyType, 'EQB')
        })
        it('should calculate fee correctly based on tx hex size', function () {
          assert.equal(txData.fee, 2605)
        })
        it('should define tx id', function () {
          assert.equal(txData.txId, expectedTxId)
        })
      })

      describe('for BTC', function () {
        before(function () {
          amount = 1000
          toAddress = 'mmFDRwLd2sNzqFHeoKJdrTdwMzVYiH4Hm6'
          changeAddr = 'mwVbp9hMyfvnjW3sEbyfgLqiGd4wMxbekh'
          txData = createTransfer(blockchainInfoBySymbol, 'BTC', amount, toAddress, changeAddr, portfolio, null, transactionFeeRates)
          expectedTxId = '7f5f9a3c889c9fd41b01581f584b204d979a59384a728beb50b54a279a4b45ab'
        })
        it('should define amount', function () {
          assert.equal(txData.amount, amount)
        })
        it('should define no assetType', function () {
          assert.ok(!txData.assetType)
        })
        it('should define currencyType', function () {
          assert.equal(txData.currencyType, 'BTC')
        })
        it('should calculate fee correctly based on tx hex size', function () {
          assert.equal(txData.fee, 2250)
        })
        it('should define tx id', function () {
          assert.equal(txData.txId, expectedTxId)
        })
      })

      describe('for blank EQB', function () {
        before(function () {
          amount = 1000
          toAddress = 'mmFDRwLd2sNzqFHeoKJdrTdwMzVYiH4Hm6'
          changeAddr = 'mwVbp9hMyfvnjW3sEbyfgLqiGd4wMxbekh'
          txData = createTransfer(blockchainInfoBySymbol, 'EQB', amount, toAddress, changeAddr, portfolio, null, transactionFeeRates)
          expectedTxId = '481bec1f3fc1f824a99f40846c4b9036b635fc78947b659c92ebbf8a51a9a50a'
        })
        it('should define amount', function () {
          assert.equal(txData.amount, amount)
        })
        it('should define no assetType', function () {
          assert.equal(txData.assetType, 'EQUIBIT')
        })
        it('should define currencyType', function () {
          assert.equal(txData.currencyType, 'EQB')
        })
        it('should calculate fee correctly based on tx hex size', function () {
          assert.equal(txData.fee, 1505)
        })
        it('should define tx id', function () {
          assert.equal(txData.txId, expectedTxId)
        })
      })
    })
  })
})

describe('models/transaction/transaction', function () {
  describe('static methods for creating a transaction', function () {
    const methods = ['makeTransaction', 'createTransfer', 'createHtlc1', 'createHtlc2', 'createHtlc3', 'createHtlc4', 'createHtlcRefund3', 'createHtlcRefund4']
    methods.forEach(method => {
      it(`should define "${method}" method`, function () {
        assert.ok(typeof Transaction[method] === 'function')
      })
    })
  })
})
