import feathers from 'feathers/client'
// import io from 'steal-socket.io'
import io from 'socket.io-client'
import jQuery from 'jquery'
import rest from 'feathers-rest/client'
import socketio from 'feathers-socketio/client'
import auth from 'feathers-authentication-client'
import hooks from 'feathers-hooks'
import environment from '../environment'
const { api, useXhrTransport } = environment

const transport = useXhrTransport ? 'rest' : 'socketio'

const feathersClient = feathers()

if (transport === 'socketio') {
  var socket = io(api, {
    transports: ['websocket']
  })
  feathersClient.configure(socketio(socket, {timeout: 60000}))
}
if (transport === 'rest') {
  feathersClient.configure(rest(api).jquery(jQuery))
}

feathersClient.configure(hooks())
  .configure(auth())

export default feathersClient
