import User from '../user/user'
import hdNode, { mnemonic } from './mock-keys'

const userMock = new User({
  _id: 0,
  email: 'user@email.com'
})
userMock.updatePasswordCache('123')
userMock.cacheWalletKeys(hdNode)
userMock.encryptedKey = userMock.encryptWithPassword('123', hdNode.toBase58())
userMock.encryptedMnemonic = userMock.encryptWithPassword('123', mnemonic)

export default userMock
