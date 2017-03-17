import fixture from 'can-fixture';
import User from '../user';

const store = fixture.store([{
  _id: 0,
  description: 'First item'
}, {
  _id: 1,
  description: 'Second item'
}], User.connection.algebra);

fixture('/users/{_id}', store);

export default store;
