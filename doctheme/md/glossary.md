https://bitcoin.org/en/glossary

**Wallet** - software that stores private keys and monitors the block chain

**HD Protocol** - a protocol that allows all of a wallet’s keys to be created from a single seed.
  - The Hierarchical Deterministic (HD) key creation and transfer protocol (BIP32), which allows creating child keys from parent keys in a hierarchy.
  - Wallets using the HD protocol are called **HD wallets**.

**Wallet system** consists of 3 parts:
  - a public key distribution program,
    - In many cases, P2PKH or P2SH hashes will be distributed instead of public keys.
    - with the actual public keys only being distributed when the outputs they control are spent.
  - a signing program,
  - and a networked program.

**Private key** - the private portion of a keypair which can create signatures that other people can verify using the public key. 256-bit number.
  - The parent private key and parent public key are regular uncompressed 256-bit ECDSA keys.
  - In HD wallets, the _master chain code_ and _master private key_ are the two pieces of data derived from the _root seed_.
  - The root seed is hashed to create 512 bits of seemingly-random data, from which the master private key and master chain code are created (together, the master extended private key).

**Root seed**
  - is created from either 128 bits, 256 bits, or 512 bits of random data.
  - To make it more convenient to use non-digital backup methods, such as memorization or hand-copying, BIP39 defines a method for creating a 512-bit root seed from a pseudo-sentence (mnemonic) of common natural-language words which was itself created from 128 to 256 bits of entropy and optionally protected by a password.
    - 12 words -> 128 entropy bits;
    - 24 words -> 256 entropy bits.

**Public key** - the public portion of a keypair which can be used to verify signatures made with the private portion of the keypair.
  - ECDSA Public Key
  - Bitcoin ECDSA public keys represent a point on a particular Elliptic Curve (EC) defined in secp256k1. In their traditional uncompressed form, public keys contain an identification byte, a 32-byte X coordinate, and a 32-byte Y coordinate.

**Compressed Public Key** - An ECDSA public key that is 33 bytes long rather than the 65 bytes of an uncompressed public key.
  - this is achieved with no data loss by dropping the Y coordinate and adding an extra bit. This is possible because only two points along the curve share any particular X coordinate, so the 32-byte Y coordinate can be replaced with a single bit indicating whether the point is on what appears in the illustration as the "top" side or the "bottom" side.

**Payment address**
  - A 20-byte hash formatted using `base58check` to produce either a P2PKH or P2SH Bitcoin/Equibit address.

Links:
- Bitcoin Developer Guide: https://bitcoin.org/en/developer-guide
  - Wallets: https://bitcoin.org/en/developer-guide#wallets