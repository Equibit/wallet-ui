import feathers from 'feathers/client';
import io from 'steal-socket.io';
import jQuery from 'jquery';
import rest from 'feathers-rest/client';
import socketio from 'feathers-socketio/client';
import auth from 'feathers-authentication-client';
import hooks from 'feathers-hooks';

const transport = 'socketio';

const feathersClient = feathers();

if (transport === 'socketio') {
  var socket = io('http://localhost:3030', {
    transports: ['websocket']
  });
  feathersClient.configure(socketio(socket));
}
if (transport === 'rest') {
  feathersClient.configure(rest('http://localhost:3030').jquery(jQuery));
}

feathersClient.configure(hooks())
  .configure(auth());

export default feathersClient;
