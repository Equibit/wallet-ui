import Session from '~/models/session'

let timeoutTime
let timeoutHandle
let refreshHandle
let logoutHandler
const eventNames = ['mousedown', 'keydown', 'click', 'touchstart']

function setupLogoutTimer (time, logout) {
  timeoutTime = time
  logoutHandler = logout
  if (timeoutHandle) {
    clearLogoutTimer()
  }
  timeoutHandle = setTimeout(logoutHandler, timeoutTime)
  refreshHandle = setInterval(Session.refresh.bind(Session), timeoutTime / 2)
  eventNames.forEach(eventName => {
    document.addEventListener(eventName, resetLogoutTimer, true)  // capture phase, to ensure that it always happens.
  })
}

function clearLogoutTimer () {
  clearTimeout(timeoutHandle)
  clearInterval(refreshHandle)
  timeoutHandle = null
  eventNames.forEach(eventName => {
    document.removeEventListener(eventName, resetLogoutTimer, true)  // capture phase, to ensure that it always happens.
  })
}

function resetLogoutTimer (time) {
  clearTimeout(timeoutHandle)
  clearInterval(refreshHandle)
  if (typeof time === 'number') {
    timeoutTime = time
  }
  timeoutHandle = setTimeout(logoutHandler, timeoutTime)
  refreshHandle = setInterval(Session.refresh.bind(Session), timeoutTime / 2)
}

export {
  setupLogoutTimer,
  clearLogoutTimer,
  resetLogoutTimer
}

export default {
  setupLogoutTimer,
  clearLogoutTimer,
  resetLogoutTimer
}
