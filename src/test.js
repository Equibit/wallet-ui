import F from 'funcunit';
import QUnit from 'steal-qunit';

import 'wallet-ui/models/test';

import 'wallet-ui/components/page-signup/page-signup-test';

import 'wallet-ui/components/page-home/page-home-test';

import 'wallet-ui/components/page-home/page-home-test';

import 'wallet-ui/components/page-portfolio/page-portfolio-test';

import 'wallet-ui/components/page-login/page-login-test';

import 'wallet-ui/components/page-settings/page-settings-test';

import 'wallet-ui/components/page-four-oh-four/page-four-oh-four-test';

F.attach(QUnit);

QUnit.module('wallet-ui functional smoke test', {
  beforeEach () {
    F.open('./development.html');
  }
});

QUnit.test('wallet-ui main page shows up', function () {
  F('title').text('wallet-ui', 'Title is set');
});
