import User from '../user/user'
import hdNode from './mock-keys'

const userMock = new User({
  _id: 0
})
userMock.updatePasswordCache('123')
userMock.cacheWalletKeys(hdNode)
userMock.encryptedKey = userMock.encryptWithPassword('123', hdNode.toBase58())

export default userMock
