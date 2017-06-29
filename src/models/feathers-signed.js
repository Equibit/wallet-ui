import signed from 'feathers-authentication-signed/client'
import crypto from '@equibit/wallet-crypto/dist/wallet-crypto'

const options = {
  ...crypto
}

export default signed(options)
