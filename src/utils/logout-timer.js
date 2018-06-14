let timeoutTime
let timeoutHandle
let logoutHandler
const eventNames = ['mousedown', 'keydown', 'click', 'touchstart']

function setupLogoutTimer (time, logout) {
  timeoutTime = time
  logoutHandler = logout
  if (timeoutHandle) {
    clearLogoutTimer()
  }
  timeoutHandle = setTimeout(logoutHandler, timeoutTime)
  eventNames.forEach(eventName => {
    document.addEventListener(eventName, resetLogoutTimer, true)  // capture phase, to ensure that it always happens.
  })
}

function clearLogoutTimer () {
  clearTimeout(timeoutHandle)
  timeoutHandle = null
  eventNames.forEach(eventName => {
    document.removeEventListener(eventName, resetLogoutTimer, true)  // capture phase, to ensure that it always happens.
  })
}

function resetLogoutTimer (time) {
  clearTimeout(timeoutHandle)
  if (typeof time === 'number') {
    timeoutTime = time
  }
  timeoutHandle = setTimeout(logoutHandler, timeoutTime)
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
