import assert from 'chai/chai';
import 'steal-mocha';
import stache from 'can-stache';
import 'can-view-import';
import './company-metadata';

describe('components/page-issuances/company-metadata', function () {
  it('should render issuance name', function () {
    let data = {
      issuance: {
        issuanceName: 'Series 1',
        issuanceType: 'Common Shares',
        restriction: '1',
        volume24h: 1541,

        sharesAuthorized: 10000,
        sharesIssued: 8459,
        sharesDividend: 764,
        sharesDividendYield: 2.6
      }
    };
    let template = stache('<company-metadata {issuance}="issuance" currency="μBTC" />');
    let frag = template(data);
    assert.equal(frag.querySelector('.column').lastChild.wholeText.trim(), 'Series 1');
  });
});
