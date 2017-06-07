import fixture from 'can-fixture';

fixture('GET /portfolios', function () {
  return [{
    _id: 1,
    balance: 45.2392,
    totalCash: 14.616393,
    totalSec: 30.622807,
    unrealizedPL: 1.357,
    unrealizedPLPercent: 2.3,
    companiesMnt: 16,
    tradesMnt: 204
  }];
});
