/*eslint-disable */
import { Selector, ClientFunction } from 'testcafe'

fixture `Getting Started`
    .page `http://localhost:8080/`
    // .page `qa-wallet.equibitgroup.com`
    .beforeEach( async t => {
        await t
            .typeText('.form-control', 'bullish')
            .click('button[type="submit"]')
    })

const inputEmail = Selector('#inputEmail').with({timeout: 20000})
const inputPassword = Selector('#inputPassword').with({timeout: 20000})
const getPageUrl = ClientFunction(() => window.location.href);

test('Successfully log in', async t => {
    await t
        .typeText(inputEmail, 'test@evenset.com')
        .typeText(inputPassword, 'SpicyTunaMayo')
        .click('button[type="submit"]')
        .expect(getPageUrl()).contains('portfolio')
})
/*eslint-enable */
