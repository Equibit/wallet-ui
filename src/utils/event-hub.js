/**
 * A simple singleton event emitter for sending messages across the app
 */
import canEvent from 'can-event'
import assign from 'can-util/js/assign/assign'

const hub = {}
assign(hub, canEvent)

// Predefined alerts:
const dispatchAlertError = err => {
  console.error(err)
  return hub.dispatch({
    'type': 'alert',
    'kind': 'danger',
    'title': 'System error',
    'message': `Sorry, an error occurred. Message: ${err.message}`,
    'displayInterval': 20000
  })
}

export default hub
export { dispatchAlertError }
