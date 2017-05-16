import fixture from 'can-fixture';
import _ from 'lodash';

const asksMnt = 21;
const bidsMnt = 20;
const maxVal = 800;
// Should be an odd number:
const totalMnt = asksMnt + bidsMnt;

let asksVal = maxVal;

fixture('GET /market-depth', function () {
  return {
    _id: 1,
    asks: _.times(asksMnt, i => (
      i < asksMnt / 2
        ? maxVal
        : (asksVal = asksVal - Math.floor(Math.random()*10), asksVal)
    )),
    bids: _.times(asksMnt, i => i ),
    cats: _.times(totalMnt, i => '30,' + (50 + i * 12))
  };
});
