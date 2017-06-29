import User from '../user/user'
import hdNode from './mock-keys'

const userMock = new User({})
userMock.cacheWalletKeys(hdNode)

export default userMock
