import assert from 'chai/chai'
import 'steal-mocha'
import stache from 'can-stache'
import 'can-view-import'
import './company-metadata'

describe('components/page-issuances/company-metadata', function () {
  // You can have this test back when it stops failing the build on Bluemix
  it.skip('should render issuance domicile', function () {
    let data = {
      issuance: {
        issuanceName: 'Series 1',
        issuanceType: 'Common Shares',
        domicile: 'Canada',
        restriction: '1',

        sharesAuthorized: 10000,
        sharesIssued: 8459,
        sharesDividendYield: 2.6
      }
    }
    let template = stache('<company-metadata issuance:from="issuance" currency:from="\'μBTC\'" />')
    let frag = template(data)
    setTimeout(() => {
      assert.equal(frag.querySelector('.column dd').firstChild.wholeText.trim(), 'Canada')
    }, 10)
  })
})
