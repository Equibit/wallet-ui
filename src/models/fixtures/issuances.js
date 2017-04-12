import fixture from 'can-fixture';
import Issuance from '~/models/issuance';

const store = fixture.store([{
  _id: 0,
  company: 'Imperial Brands',
  domicile: 'USA',
  issuance: 'Series 1',
  issuanceType: 'Common Shares',
  restriction: '1',
  marketCap: 285123700,
  changeBtc: 502,
  changePercentage: 0.74
}, {
  _id: 1,
  company: 'Johnson & Johnson',
  domicile: 'UK',
  issuance: 'Series 2',
  issuanceType: 'Trust Units',
  restriction: 'None',
  marketCap: 785123700,
  changeBtc: -659,
  changePercentage: 0.67
}], Issuance.connection.algebra);

fixture('/users/{_id}', store);
fixture('POST /issuances', function (request, response) {
  response(request.data);
});

export default store;
