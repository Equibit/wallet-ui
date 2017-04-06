import fixture from 'can-fixture';
import User from '~/models/user/user';

const store = fixture.store([{
  _id: 0,
  description: 'First item'
}, {
  _id: 1,
  description: 'Second item'
}], User.connection.algebra);

fixture('/users/{_id}', store);
fixture('POST /users', function (request, response) {
  response(request.data);
});

export default store;
