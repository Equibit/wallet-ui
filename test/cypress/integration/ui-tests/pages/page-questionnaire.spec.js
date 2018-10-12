'use strict'

describe('Questionnaire Test', () => {
  beforeEach(() => {
    cy.clearUserAnswersAndUserQuestionnaires()
    cy.loginQA()
    cy.fixture('users').then(users => {
      cy.login(users.validUsers[0])
    })
  })

  it('user can see Airdrop and button leading to questionnaire', () => {
    cy.get('[data-cy=questionnaire-promo]')
      .should('contain', 'EQB Airdrop')

    cy.get('[data-cy=questionnaire-button]')
      .should('contain', 'Get me my FREE EQB')
      .and('have.attr', 'href', '/questionnaire')
  })

  it('user can navigate to questionnaire through button or through dropdown', () => {
    cy.get('[data-cy=questionnaire-button]').click()
    cy.url().should('contain', '/questionnaire')
    cy.get('[data-cy=userDropdown]').click()
    cy.contains('My Portfolio').click()
    cy.url().should('contain', '/portfolio')
    cy.get('[data-cy=loading-overlay]').should('not.be.visible')
    cy.goTo('questionnaire')
    cy.url().should('contain', '/questionnaire')
  })

  it('user is greeted with questionnaire and disclaimer', () => {
    cy.goTo('questionnaire')

    cy.contains('h2', 'Investor Questionnaire').should('be.visible')
    cy.get('[data-cy=privacy-disclaimer]')
      .should('contain', 'All information gathered will be used for general analytical purposes only.')
      .and('contain', 'Individual responses will not be given to any third parties at any time.')
      .and('be.visible')

    cy.contains('h4', 'What best describes your interest in Equibit?').should('be.visible')
    cy.contains('h4', 'How likely are you to use Equibit Portfolio to invest in a company?').should('be.visible')

    cy.get('[data-cy=submit-questionnaire]')
      .should('be.visible')
      .and('contain', 'Submit Your Answers')
      .and('have.attr', 'on:click', 'submitAnswers()')
  })

  it('user must answer all questions shown on the page', () => {
    cy.goTo('questionnaire')
    cy.get('[data-cy=submit-questionnaire]').click()
    cy.get('.alert-warning')
      .should('contain', 'Questionnaire submission failed')
      .and('contain', 'Your answers were incomplete or invalid')

    let index
    const radios = []
    cy.get('input[type=radio]').then((radio) => {
      for (index = 0; index < radio.length; index++) {
        radios.push(Object.values(radio)[index].id)
      }
      for (index = 1; index < 9; index++) {
        if (radios.includes(`radio-${index}-B`)) {
          cy.get(`#radio-${index}-B`).click()
        } else {
          cy.get(`#checkbox-${index}-B`).click()
        }
      }
    })
    cy.get('[data-cy=submit-questionnaire]').click()
    cy.get('.alert-warning')
      .should('contain', 'Questionnaire submission failed')
      .and('contain', 'Your answers were incomplete or invalid')

    cy.get('#radio-0-B').check()
    cy.get('[data-cy=submit-questionnaire]').click()
    cy.get('.alert-success')
      .should('contain', 'Questionnaire complete')
      .and('contain', 'Your reward will be delivered shortly')
  })

  it('user can skip to end of test', () => {
    cy.goTo('questionnaire')

    cy.get('#radio-0-A').check()
    cy.contains('h4', 'What best describes your interest in Equibit?').should('be.visible')
    cy.contains('h4', 'How likely are you to use Equibit Portfolio to invest in a company?').should('not.be.visible')
    cy.contains('h4', 'What languages are you most comfortable using or conducting business in? (choose all that apply)').should('not.be.visible')

    cy.get('[data-cy=submit-questionnaire]').click()
    cy.get('.alert-success')
      .should('contain', 'Questionnaire complete')
      .and('contain', 'Your reward will be delivered shortly')
  })

  it('user can skip questions', () => {
    cy.goTo('questionnaire')

    cy.get('#radio-0-D').check()
    cy.contains('h4', 'What best describes your interest in Equibit?').should('be.visible')
    cy.contains('h4', 'How likely are you to use Equibit Portfolio to invest in a company?').should('not.be.visible')
    cy.contains('h4', 'What languages are you most comfortable using or conducting business in? (choose all that apply)').should('be.visible')
  })

  it('user can select multiple answers', () => {
    cy.goTo('questionnaire')

    cy.get('#radio-0-D').check()
    cy.get('#checkbox-7-A').check()
    cy.get('#checkbox-7-B').check()
    cy.get('#checkbox-8-A').check()
    cy.get('#checkbox-8-B').check()
    cy.get('[data-cy=submit-questionnaire]').click()
    cy.get('.alert-success')
      .should('contain', 'Questionnaire complete')
      .and('contain', 'Your reward will be delivered shortly')
  })

  it('user can provide their own answer', () => {
    cy.goTo('questionnaire')

    cy.get('#radio-0-D').check()
    cy.get('input[type="text"]').type('Finnish')
    cy.get('#checkbox-8-A').check()

    cy.get('[data-cy=submit-questionnaire]').click()
    cy.get('.alert-success')
      .should('contain', 'Questionnaire complete')
      .and('contain', 'Your reward will be delivered shortly')
  })

  it('user can select multiple answers and provide their own answer', () => {
    cy.goTo('questionnaire')

    cy.get('#radio-0-D').check()
    cy.get('#checkbox-7-A').check()
    cy.get('#checkbox-7-B').check()
    cy.get('input[type="text"]').type('Finnish')
    cy.get('#checkbox-8-A').check()
    cy.get('#checkbox-8-B').check()

    cy.get('[data-cy=submit-questionnaire]').click()
    cy.get('.alert-success')
      .should('contain', 'Questionnaire complete')
      .and('contain', 'Your reward will be delivered shortly')
  })

    // Reward system for completing questionnaires is not yet live
  it.skip('user receives reward', () => {

  })

    // Airdrop still visible even after answering the questionnaire
  it.skip('user no longer sees Airdrop after submitting questionnaire', () => {
    cy.goTo('questionnaire')

    cy.get('#radio-0-A').check()
    cy.get('[data-cy=submit-questionnaire]').click()
    cy.url().should('contain', '/portfolio')

    cy.get('[data-cy=questionnaire-promo]')
      .should('not.exist')
    cy.get('[data-cy=questionnaire-button]')
      .should('not.exist')
  })
})
