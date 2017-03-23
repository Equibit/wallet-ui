import feathers from 'feathers/client';
import jQuery from 'jquery';
import rest from 'feathers-rest/client';
import auth from 'feathers-authentication-client';
import hooks from 'feathers-hooks';

const feathersClient = feathers()
  .configure(rest('http://localhost:3030').jquery(jQuery))
  .configure(hooks())
  .configure(auth());

export default feathersClient;
