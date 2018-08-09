import 'steal-mocha'
import assert from 'chai/chai'
import MockQuestionnaire from '~/models/mock/mock-questionnaire'

import { ViewModel } from './page-questionnaire'

const getDefaultAnswers = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
  questionSortIndex => ({
    questionSortIndex,
    answer: {
      custom: '',
      selection: null
    }
  })
)

// ViewModel unit tests
describe('wallet-ui/components/page-questionnaire', function () {
  // todo: to fix we need to mock session (which populates keys for the issuance) or change the way its implemented.
  it('derives questions from the questionnaire', function () {
    const vm = new ViewModel({ questionnaire: MockQuestionnaire })
    assert.equal(vm.questions.length, 10)
  })

  it('has the right length of answers', function () {
    const vm = new ViewModel({ questionnaire: MockQuestionnaire })
    assert.equal(vm.userAnswers.length, 10)
  })

  it('has the right length of enabled questions', function () {
    const vm = new ViewModel({ questionnaire: MockQuestionnaire })
    assert.equal(vm.enabledQuestions.length, 10)
  })

  it('has all questions enabled by default', function () {
    const vm = new ViewModel({ questionnaire: MockQuestionnaire })
    assert(vm.enabledQuestions.every(isEnabled => isEnabled))
  })

  it('disables all questions after a final answer', function () {
    const resps = getDefaultAnswers()
    resps[0].answer.selection = 0
    const vm = new ViewModel({ questionnaire: MockQuestionnaire, userAnswers: resps })
    assert(vm.enabledQuestions.every(
      (isEnabled, index) => index === 0 ? isEnabled : !isEnabled)
    )
  })

  it('disables all questions after a final answer', function () {
    const resps = getDefaultAnswers()
    resps[0].answer.selection = 0
    const vm = new ViewModel({ questionnaire: MockQuestionnaire, userAnswers: resps })
    assert(vm.enabledQuestions.every(
      (isEnabled, index) => index === 0 ? isEnabled : !isEnabled)
    )
  })

  it('disables all questions until a specified answer', function () {
    const resps = getDefaultAnswers()
    resps[0].answer.selection = 3
    const vm = new ViewModel({ questionnaire: MockQuestionnaire, userAnswers: resps })
    assert(vm.enabledQuestions.every(
      (isEnabled, index) => index === 0 || index > 6 ? isEnabled : !isEnabled)
    )
  })
})
