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
import UserQuestionnaire from '../../models/user-questionnaire'
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
  userQuestionnaire: {
    get (val, resolve) {
      if (val) {
        return val
      }
      const questionnaireId = route.data.itemId
      const userId = this.user && this.user._id
      if (!(questionnaireId && userId)) {
        return null
      }
      UserQuestionnaire.getList({
        questionnaireId,
        userId
      }).then(
        questionnaires => {
          if (questionnaires && questionnaires.length) {
            resolve(questionnaires[0])
            return
          }
          const tmp = new UserQuestionnaire({questionnaireId, userId})
          return tmp.save().then((x) => {
            console.log(x)
            resolve(tmp)
          })
        }
      )
    }
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
    get (val, resolve) {
      if (val) {
        return val
      }
      if (this.userQuestionnaire) {
        console.log(this.userQuestionnaire)
        return this.userQuestionnaire.answers.map((ans, index) => {
          if (!ans) {
            return {
              answer: null,
              custom: null
            }
          }
          // if (this.questions) {

          // }
        })
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
    const questions = this.questions
    // Update non-CUSTOM answer text value:
    this.userAnswers.forEach((answer, i) => {
      if (questions[i].answerOptions[answer.selection] !== 'CUSTOM') {
        if (answer.selection && answer.selection.length) {
          answer.answer = answer.selection.map((selected, i) => {
            return selected ? questions[i].answerOptions[selected] : null
          }).filter(a => a !== null)
        } else {
          answer.answer = questions[i].answerOptions[answer.selection]
        }
      }
    })
    console.log(this.userAnswers)

    // todo: update user after answers are saved.
    this.user.questionnaire = 'COMPLETED'

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
