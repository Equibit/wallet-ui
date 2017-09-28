import User from '../user/user'
import hdNode from './mock-keys'

const userMock = new User({
  _id: 0,
  rates: {
    btcToUsd: 4000,
    eqbToUsd: 3,
    eqbToBtc: 1,
    securitiesToBtc: 1
  }
})
userMock.cacheWalletKeys(hdNode)

export default userMock
