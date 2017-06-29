import feathers from 'feathers/client'
import io from 'steal-socket.io'
import jQuery from 'jquery'
import rest from 'feathers-rest/client'
import socketio from 'feathers-socketio/client'
import auth from 'feathers-authentication-client'
import hooks from 'feathers-hooks'
import environment from '~/environment'

const { api } = environment

// const transport = 'socketio';
const transport = 'rest'
const feathersClient = feathers()

if (transport === 'socketio') {
  var socket = io(api, {
    transports: ['websocket']
  })
  feathersClient.configure(socketio(socket))
}
if (transport === 'rest') {
  feathersClient.configure(rest(api).jquery(jQuery))
}

feathersClient.configure(hooks())
  .configure(auth())

export default feathersClient
