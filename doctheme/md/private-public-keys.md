To generate a private key:
- generate a 12 word phrase (referred to as "mnemonic" or "mnemonic sentence");
- converting a mnemonic into a binary seed called _root seed_ (`bip39.mnemonicToEntropy`):
  - 512bit;
  - PBKDF2 with a mnemonic as a password and the string "mnemonic" + passphrase used as the salt;
    - hashed 2,048 times using HMAC-SHA512.
- generate deterministic wallets using BIP-0032 or similar methods.

To generate a public key:
- `point(private_key) == public_key`

Links:
- https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
- https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki