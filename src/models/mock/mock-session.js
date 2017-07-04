import Session from '../session'

// Mock Session:
Session.current = new Session({
  user: {
    rates: {
      btcToUsd: 2725,
      eqbToUsd: 3,
      eqbToBtc: 3 / 2725
    }
  }
})
