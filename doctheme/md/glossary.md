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

Links:
- Bitcoin Developer Guide. Wallets: https://bitcoin.org/en/developer-guide#wallets