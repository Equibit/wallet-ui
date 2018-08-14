import route from 'can-route'
import Component from 'can-component'
import DefineMap from 'can-define/map/'

import hub from '~/utils/event-hub'
import { translate } from '~/i18n'
import './page-questionnaire.less'
import view from './page-questionnaire.stache'
import Questionnaire, { Question } from '../../models/questionnaire'
import UserQuestionnaire from '../../models/user-questionnaire'
import Session from '../../models/session'


export const ViewModel = DefineMap.extend({
  questionnaire: {
    get (val, resolve) {
      if (val) {
        return val
      }
      const _id = route.data.itemId
      Questionnaire.get({_id}).then(questionnaire => {
        resolve(questionnaire)
      })
    }
  },
  questions: {
    get () {
      return this.questionnaire ? this.questionnaire.questions : new Question.List([])
    }
  },
  userAnswers: {
    get (val) {
      if (val) {
        return val
      }
      if (this.questions) {
        const questions = this.questions
        return (
          questions.map(q => {
            return {
              questionId: q._id,
              questionSortIndex: q.sortIndex,
              answer: new DefineMap({
                custom: '',
                selection: q.questionType === 'SINGLE' ? null : []
              })
            }
          })
        )
      }
    }
  },

  choices (list) {
    return list ? list.join(', ') : ''
  },

  indexLetter (index) {
    return String.fromCharCode('A'.charCodeAt(0) + index)
  },

  enabledQuestions: {
    get () {
      const result = []
      let nextQuestion = 0
      let curr = 0
      if (!(this.questions && this.userAnswers)) {
        return result
      }
      while (curr < this.questions.length) {
        if (curr < nextQuestion) {
          result.push(false)
          curr += 1
          continue
        } else {
          result.push(true)
        }
        const selection = this.userAnswers[curr].answer.selection
        if (selection === null || selection === undefined || selection.length === 0) {
          curr += 1
          nextQuestion = curr
          continue
        }
        if (selection.length) {
          const skipTos = selection.map(
            optionIndex => this.questions[curr].answerOptions[optionIndex]
          ).map(
            option => option.finalQuestion ? Infinity : (option.skipTo - 1) || 0
          )
          curr += 1
          nextQuestion = Math.max(...skipTos, curr)
          continue
        }
        const answerOption = this.questions[curr].answerOptions[selection]
        if (answerOption.finalQuestion) {
          nextQuestion = Infinity
        } else if (answerOption.skipTo) {
          nextQuestion = Math.max(answerOption.skipTo - 1, curr + 1)
        }
        curr += 1
      }
      return result
    }
  },

  submitAnswers () {
    const toSave = new UserQuestionnaire({
      questionnaireId: route.data.itemId,
      answers: this.userAnswers.map(({answer}, index) => {
        const question = this.questions[index]
        if (this.enabledQuestions[index]) {
          if (answer.selection || answer.selection === 0) {
            if (question.questionType === 'SINGLE') {
              if (question.answerOptions[answer.selection].answer === 'CUSTOM') {
                return answer.custom
              } else {
                return question.answerOptions[answer.selection].answer
              }
            } else {
              if (answer.selection.length === 0) {
                return null
              }
              return answer.selection.map(selected => {
                const option = question.answerOptions[selected].answer
                if (option === 'CUSTOM') {
                  return answer.custom
                } else {
                  return option
                }
              })
            }
          }
        }
        return null
      }),
      address: Session.current.portfolios[0].addressesEqb[0]
    })
    toSave.save().then(
      saved => {
        const message = saved.status === 'REWARDED'
        ? translate('rewardSent')
        : translate('rewardDelayed')

        const options = {
          type: 'alert',
          kind: 'success',
          title: translate('questionnaireSubmissionComplete'),
          displayInterval: 8000,
          message
        };
        hub.dispatch(options);

        route.data.page = 'questionnaires'
      },
      e => {
        const message = e.message === 'Completed answer array is invalid!'
          ? translate('invalidAnswers')
          : translate('tryAgainLater')
        const options = {
          type: 'alert',
          kind: 'warning',
          title: translate('questionnaireSubmissionFailed'),
          displayInterval: 8000,
          message
        };
        hub.dispatch(options);
      }
    )
  },

  selectCustom (question, num) {
    if (question.answer.selection && question.answer.selection.indexOf) {
      if (question.answer.selection.indexOf(num) === -1) {
        question.answer.selection.push(num)
      }
    } else {
      question.answer.selection = num
    }
  }
})

export default Component.extend({
  tag: 'page-questionnaire',
  ViewModel,
  view
})
