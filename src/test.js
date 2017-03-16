import F from 'funcunit';
import QUnit from 'steal-qunit';

import 'wallet-ui/models/test';

import 'wallet-ui/signup/signup-test';

F.attach(QUnit);

QUnit.module('wallet-ui functional smoke test', {
  beforeEach() {
    F.open('./development.html');
  }
});

QUnit.test('wallet-ui main page shows up', function () {
  F('title').text('wallet-ui', 'Title is set');
});
