## When user logs in app does the following:

1. Loads portfolios of the user (with portfolio index, no portfolio keys)   // session.js
  - portfolio <name, index, addressesMeta>
  - addresses: addressMeta<index, type=BTC, isChange, isUsed>
2. Derives keys for portfolio and addresses based on <index, isChange>.     // session.js
  - addresses: +addressMeta<address, keyPair>                               // <<< portfolio.js
3. Loads unspent TO based on addresses                                      // session.js
  - calculates balance summary
    - updates portfolio<userBalance=balance>                                // session.js
    - portfolio.balance uses userBalance to update addresses:               // <<< portfolio.js
      - addresses: +addressMeta<amount, txouts>