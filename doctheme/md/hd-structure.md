## HD Wallet Structure

This describes how BIP44 is used for Equibit portfolios, companies, including the following transaction types:
- sending/receiving Empty EQB;
- authorizing securities (issuances);
- canceling securities;
- trading securities;
- sending/receiving securities.

The whole idea to use BIP44 for everything is to simplify xpub crawling and thus the import process.

### Transaction artefacts

Portfolio accounts can store:
- cash (BTC, empty EQB)
- trading securities (EQB)
- received securities (EQB)

Company accounts can store:
- authorized securities (with issuance_json) (EQB)

### BIP-44

```
/ m / purpose' / coin_type' / account' / change / address_index
```

Example: Bitcoin keys
```
/m /44' /0' / account' / change / address_index
```

The `account` level can be used for both portfolios and companies.

### Portfolios with cash and securities:

```
Bitcoin:
/m /44' /0' /<portfolio>'       - BTC portfolio XPUB
                      /0 /<i>   - BTC ADDR to receive BTC
                      /1 /<i>   - BTC change addresses

Equibit:
/m /44' /72' /<portfolio>'      - EQB portfolio XPUB
                      /0
                          /0    - Trading address (to receive trading issuances EQB)
                          /1    - Holding address (to move traded restricted issuances EQB to)
                          /<i>  - EQB receiver ADDR for Blank EQB and unrestricted issuances
                      /1
                          /<i>  - EQB change ADDR for Blank EQB
```

### Companies and authorized Issuances (Equibit blockchain only)
```
/m /44' /72' /<company>' /0
                            /<issuance> - EQB address for authorized EQB (with JSON)
                            /...
                         /1             - N/A, no usage of change addresses
```