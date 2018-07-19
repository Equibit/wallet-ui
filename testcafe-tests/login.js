/*eslint-disable */
import { Selector } from 'testcafe'

fixture `Getting Started`
    // .page `http://localhost:8080/`
    .page `qa-wallet.equibitgroup.com`

const inputEmail = Selector('#inputEmail').with({timeout: 20000})
const inputPassword = Selector('#inputPassword').with({timeout: 20000})
const panelTitle = Selector('.panel-title')

test('Successfully log in', async t => {
    await t
        .typeText('.form-control', 'bullish')
        .click('button[type="submit"]')
        .typeText(inputEmail, 'elliott@evenset.com')
        .typeText(inputPassword, 'password123')
        .click('button[type="submit"]')
        .expect(panelTitle.innerText).contains('My Portfolio', 'Title contains expected title')
})
/*eslint-enable */
