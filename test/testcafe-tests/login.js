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

const email = Selector('#inputEmail')
const password = Selector('#inputPassword')

test('greets user with Log In', async t => {
    const header = Selector('.form-signin-heading').addCustomDOMProperties({
        innerHTML: el => el.innerHTML
    })

    await t
        .expect(header.innerHTML)
        .contains('Log In', 'header does not contain log in')
})

test('links to Sign Up flow', async t => {
    const signUp = Selector('a[href="/signup"]')

    await t
        .expect(signUp.getAttribute('href'))
        .contains('/signup', 'sign up link found')
})

test('links to Forget Password flow', async t => {
    const forgotPassword = Selector('.btn.btn-link.pull-right')

    await t
        .expect(forgotPassword.getAttribute('href'))
        .contains('/forgot-password', 'forgot password link not found')
})

test('requires email', async t => {
    const error = Selector('.form-text').addCustomDOMProperties({
        innerHTML: el => el.innerHTML
    })

    await t
        .typeText(password, 'testpassword')
        .click('button[type="submit"]')
        .expect(error.innerHTML)
        .contains('Email is missing', 'missing email error not found')
})

test('requires password', async t => {
    const error = Selector('.form-text').addCustomDOMProperties({
        innerHTML: el => el.innerHTML
    })

    await t
        .typeText(email, 'test@evenset.com')
        .click('button[type="submit"]')
        .expect(error.innerHTML)
        .contains('Password is missing', 'missing password error not found')
})

test('requires valid email', async t => {
    const error = Selector('.form-text').addCustomDOMProperties({
        innerHTML: el => el.innerHTML
    })

    await t
        .typeText(email, 'test')
        .typeText(password, 'testpassword')
        .click('button[type="submit"]')
        .expect(error.innerHTML)
        .contains('Enter a valid email address', 'invalid email error not found')
})

test('requires valid email and password', async t => {
    const error = Selector('.alert').addCustomDOMProperties({
        innerHTML: el => el.innerHTML
    })

    await t
        .typeText(email, 'test@evenset.com')
        .typeText(password, 'testpassword')
        .click('button[type="submit"]')
        .expect(error.innerHTML)
        .contains('Invalid login.', 'invalid login alert not found')
})

test('successfully log in using UI', async t => {
    const getPageUrl = ClientFunction(() => window.location.href)

    await t
        .typeText(email, 'test@evenset.com')
        .typeText(password, 'SpicyTunaMayo')
        .click('button[type="submit"]')
        .expect(getPageUrl())
        .contains('portfolio')
})
/*eslint-enable */
