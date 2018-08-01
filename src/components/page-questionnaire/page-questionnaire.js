import Component from 'can-component'
import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/'
import value from 'can-value'
import './page-questionnaire.less'
import view from './page-questionnaire.stache'
import Session from '../../models/session'
// import Answer from '../../models/answer'
import route from 'can-route'
import Questionnaire, { Question } from '../../models/questionnaire'
// import questionStore from '../../models/fixtures/questions'

export const ViewModel = DefineMap.extend({
  user: {
    get (val) {
      return (Session.current && Session.current.user) || val
    }
  },
  error: 'string',
  phone: 'string',
  code: 'string',
  answers: {
    // 2D array. First index == the question number, inner array == the answer(s) selected for that question
    type: '*'
  },
  customAnswers: {
    // array. index == the question number, value == the custom answer given (if any) for that question
    type: '*'
  },
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
            console.log(q)
            return {
              userId: this.user && this.user._id,
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
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'][index]
  },

  sendPhone () {
    this.error = ''
    if (!this.user) {
      throw new Error('User is not defined')
    }
    this.user.assign({
      phoneNumber: this.phone
    })
    this.user.save().then(user => {
      console.log(`Sent phone: questionnaire=${user.questionnaire}`, user)
    })
  },
  sendCode () {
    this.error = ''
    if (!this.user) {
      throw new Error('User is not defined')
    }
    this.user.assign({
      smsCode: this.code
    })
    this.user.save().catch(err => {
      this.error = err.message
    })
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
