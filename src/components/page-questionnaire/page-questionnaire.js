import Component from 'can-component'
import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/'
import './page-questionnaire.less'
import view from './page-questionnaire.stache'
import Session from '../../models/session'
// import Answer from '../../models/answer'
import route from 'can-route'
import Questionnaire, { Question } from '../../models/questionnaire'
// import questionStore from '../../models/fixtures/questions'

export const ViewModel = DefineMap.extend({
  questionnaire: {
    get (val, resolve) {
      if (val) {
        return val
      }
      const _id = route.data.itemId
      Questionnaire.get({_id}).then(questionnaire => {
        console.log(questionnaire.questions)
        resolve(questionnaire)
      })

    }
  },
  questions: {
    get () {
      return this.questionnaire ? this.questionnaire.questions : []
    }
  },
  userAnswers: {
    get (val) {
      if (val) {
        return val
      }
      if (this.questions) {
        const questions = this.questions.get ? this.questions.get() : this.questions
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
            optionIndex => this.questions[nextQuestion].answerOptions[optionIndex]
          ).map(
            option => option.finalQuestion ? Infinity : (option.skipTo - 1) || 0
          )
          curr += 1
          nextQuestion = Math.max(...skipTos, curr)
          continue
        }
        const answerOption = this.questions[nextQuestion].answerOptions[selection]
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
    console.log(this.userAnswers)

    // todo: update user after answers are saved.
    // this.user.questionnaire = 'COMPLETED'

    // this.answers.forEach(a => a.save())
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
