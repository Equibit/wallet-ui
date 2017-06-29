let hostname = window.location.hostname
let proto = window.location.protocol
let host = hostname === 'localhost' ? 'localhost:3030' : `api-${hostname}`

export default {
  api: `${proto}//${host}`
}
