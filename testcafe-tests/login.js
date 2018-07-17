import { Selector } from 'testcafe';

fixture `Getting Started`
    // .page `http://localhost:8080/`
    .page `qa-wallet.equibitgroup.com`

const inputEmail = Selector('.form-control')
const loginHeader = Selector('.form-signin-heading')

test('My First Test', async t => {
    await t
        .typeText(inputEmail, 'bullish')
        .click('.btn')
        .expect(loginHeader.innerText).contains('Log In')
})