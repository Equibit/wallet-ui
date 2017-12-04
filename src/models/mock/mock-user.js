import User from '../user/user'
import hdNode from './mock-keys'
import rates from './mock-rates'

const userMock = new User({
  _id: 0,
  rates
})
userMock.updatePasswordCache('123')
userMock.cacheWalletKeys(hdNode)

export default userMock
