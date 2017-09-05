import Session from '../session'
import userMock from './mock-user'

// Mock Session:
Session.current = new Session({
  user: userMock
})
