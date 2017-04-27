import fixture from 'can-fixture';

fixture('GET /market', function () {
  return {
    newIssuances: 420,
    volume: 34058,
    tradesNum: 4931,
    shareVolume: 63 * 1000,
  }
});
