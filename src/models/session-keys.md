## Managin keys

### Portfolios with cash and issuances
```text
/m' /0'  /<portfolio_index>'      - BTC portfolio XPUB
         /...
                            /0    - BTC receiver ADDR for BTC
                            /1    - BTC change ADDR

/m' /72' /<portfolio_index>'      - EQB portfolio XPUB
         /...
                            /0    - EQB receiver ADDR for Blank EQB
                            /1    - EQB change ADDR for Blank EQB
                            /2    - Trading address (to receive trading issuances EQB)
                            /3    - Holding address (to move traded issuances EQB to)

```

### Companies and authorized Issuances
```
???
      /<company_index>'
                       /<issuance_index>    - EQB address for authorized EQB (with JSON)
                       /...
```