import Session from '../session'
import userMock from './mock-user'
import portfolio from './mock-portfolio'

// Mock Session:
Session.current = new Session({
  user: userMock,
  portfolios: [portfolio]
})
