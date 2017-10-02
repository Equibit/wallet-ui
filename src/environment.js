let hostname = typeof window !== 'undefined' && window.location.hostname
let proto = typeof window !== 'undefined' && window.location.protocol
let host = (hostname === 'localhost' || typeof window === 'undefined') ? 'localhost:3030' : `api-${hostname}`

export default {
  api: `${proto}//${host}`,
  isLocal: hostname === 'localhost',
  useXhrTransport: typeof window === 'undefined' || window.useXhrTransport
}
