import { bip39, bitcoin } from '@equibit/wallet-crypto/dist/wallet-crypto';

export const mnemonic = 'fine raw stuff scene actor crowd flag lend wrap pony essay stamp';
export const seed = bip39.mnemonicToSeed(mnemonic, '');
export default bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks.testnet);
