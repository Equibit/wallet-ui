import assert from 'chai/chai';
import mocha from 'steal-mocha';
import F from 'funcunit';

F.attach(mocha);

// Note: don't use arrow functions if you need to access `this` (see https://mochajs.org/#arrow-functions).
describe('wallet-ui functional smoke test', function () {
  this.timeout(5000);

  beforeEach((done) => {
    F.open('/index.html', function () {
      done();
    });
  });

  it('wallet-ui main page shows up', () => {
    let text = F('title').text();
    assert.equal(text, 'wallet-ui');
  });
});
