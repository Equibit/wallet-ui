import fixture from 'can-fixture';
import BiggestMovers from '~/models/biggest-movers';
import _ from 'lodash';

const companies = [
  'Imperial Brands', 'Allianz SE', 'Kingfisher plc', 'Deutsche Telekom', 'Experian plc',
  'Propanc Health', 'Marks And Spencer', 'Cool Technologies', 'The Pulse Beverages'
];
const store = fixture.store(_.times(50, function (i) {
  return {
    _id: i,
    companyName: companies[i % 9] + ' - ' + i,
    companySlug: companies[i % 9].toLowerCase().split(' ').join('-'),
    domicile: ['USA', 'UK', 'Poland', 'Sweden', 'France'][i % 5],
    change: [502, -601, 120, -120][i % 4],
    changePercent: [0.74, 0.56, 0.45][i % 3],
  };
}), BiggestMovers.connection.algebra);

fixture('/biggest-movers/{_id}', store);

export default store;
