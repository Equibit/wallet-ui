import feathersClient from '../feathers-client'
import signed from '../feathers-signed'

export default function login (email, password) {
  let hashedPassword = signed.createHash(password)
  let data = { email }

  return signed.sign(data, hashedPassword)
    .then(signedData => {
      return feathersClient.authenticate(Object.assign({
        strategy: 'challenge-request'
      }, signedData))
    })
    .then(({ challenge, salt, autologoutTime }) => {
      return signed.generateSecret(hashedPassword, salt).then(secret => {
        // The secret is the same as the stored password, but it
        // never gets sent across the wire.
        let data = { email, challenge }
        return signed.sign(data, secret, { expiresIn: autologoutTime + 'ms' })
      })
    })
    .then(signedData => {
      signedData.strategy = 'challenge'
      // console.log('signedData', signedData);
      return feathersClient.authenticate(signedData)
    })
}
