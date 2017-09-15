## HD Structure

This describes how BIP44 is used for Equibit portfolios, companies, including transactions of type:
- sending/receiving Empty EQB;
- authorizing securities (issuances);
- trading securities;
- sending/receiving securities.

### BIP-44

```
/ m / purpose' / coin_type' / account' / change / address_index
```

Example: Bitcoin keys
```
/m /44' /0' / account' / change / address_index
```

The `account` level can be used for both portfolios and companies.

### Transaction artefacts

Portfolio accounts can store:
- cash (BTC, empty EQB)
- trading securities (EQB)
- received securities (EQB)

Company accounts can store:
- authorized securities (with issuance_json) (EQB)

### Portfolios with cash and securities:

```text
Bitcoin:
/m /0'  /<portfolio>'           - BTC portfolio XPUB
                      /0 /<i>   - BTC ADDR to receive BTC
                      /1 /<i>   - BTC change addresses

Equibit:
/m /72' /<portfolio>'           - EQB portfolio XPUB
                      /0
                          /0    - Trading address (to receive trading issuances EQB)
                          /1    - Holding address (to move traded issuances EQB to)
                          /<i>  - EQB receiver ADDR for Blank EQB
                      /1
                          /<i>  - EQB change ADDR for Blank EQB
```

### Companies and authorized Issuances (Equibit blockchain only)
```
/m /0'  /<company>'   /0
                          /<issuance> - EQB address for authorized EQB (with JSON)
                          /...
                      /1              - N/A, no usage of change addresses
```