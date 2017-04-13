import fixture from 'can-fixture';
import Issuance from '~/models/issuance';
import _ from 'lodash';

const store = fixture.store(_.times(90, function (i) {
  return {
    _id: i,
    company: [
      'Imperial Brands', 'Allianz SE', 'Kingfisher plc', 'Deutsche Telekom', 'Experian plc',
      'Propanc Health', 'Marks & Spencer', 'Cool Technologies', 'The Pulse Beverages'][i % 9] + ' - ' + i,
    domicile: ['USA', 'UK', 'Poland', 'Sweden', 'France'][i % 5],
    issuance: ['Series 1', 'Series 2'][i % 2],
    issuanceType: ['Common Shares', 'Trust Units', 'Preferred Shares'][i % 3],
    restriction: ['1', '2', 'None'][i % 3],
    marketCap: [285123700, 285123700, 285123700][i % 3],
    change: [502, -601, 120, -120][i % 4],
    changePercentage: [0.74, 0.56, 0.45][i % 3]
  };
}), Issuance.connection.algebra);

fixture('/issuances/{_id}', store);

export default store;
