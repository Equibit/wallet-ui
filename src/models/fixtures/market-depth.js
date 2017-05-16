import fixture from 'can-fixture';
import _ from 'lodash';

const asksMnt = 61;
const bidsMnt = 40;
const maxVal = 800;
// Should be an odd number:
const totalMnt = asksMnt + bidsMnt;

let asksVal = maxVal;
let bidsVal = 0;

fixture('GET /market-depth', function () {
  return {
    _id: 1,

    asks: _.times(asksMnt - 7, i => (
      i < asksMnt / 2
        ? maxVal
        : (i < asksMnt * 0.7
            ? (asksVal = asksVal - Math.floor(Math.random()*20), asksVal)
            : (asksVal = asksVal - Math.floor(Math.random()*40), asksVal))
    )).concat(_.times(6, i => i * 60).reverse()).concat([0]).concat(_.times(bidsMnt, i => null)),

    bids: _.times(asksMnt-19, i => null).concat([0]).concat(_.times(bidsMnt+20, i => (
      i < bidsMnt / 2
        ? (bidsVal = bidsVal + Math.floor(Math.random()*45), bidsVal)
        : (bidsVal = bidsVal + Math.floor(Math.random()*15), bidsVal)
    ))),
    cats: _.times(totalMnt, i => '30,' + (100 + (i+1) * 5))
  };
});
