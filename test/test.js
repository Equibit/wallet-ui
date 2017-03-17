import assert from 'chai/chai';
import mocha from 'steal-mocha';
import F from 'funcunit';

// import 'wallet-ui/models/test';
// import 'wallet-ui/components/page-signup/page-signup-test';
// import 'wallet-ui/components/page-home/page-home-test';
// import 'wallet-ui/components/page-portfolio/page-portfolio-test';
// import 'wallet-ui/components/page-login/page-login-test';
// import 'wallet-ui/components/page-settings/page-settings-test';
// import 'wallet-ui/components/page-four-oh-four/page-four-oh-four-test';

F.attach(mocha);

describe('wallet-ui functional smoke test', () => {
  beforeEach((done) => {
    console.log('beforeEach');
    F.open('/index.html').then(function () {
      done();
    });
  });

  it('wallet-ui main page shows up', () => {
    let text = F('title').text();
    assert.equal(text, 'wallet-ui');
  });
});
