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

  userQuestionnairePromise: {
    get (val) {
      if (val) {
        return val
      }
      const questionnaireId = route.data.itemId
      const userId = this.user && this.user._id
      if (!(questionnaireId && userId)) {
        return null
      }
      return UserQuestionnaire.getList({
        questionnaireId,
        userId
      }).then(
        questionnaires => {
          if (questionnaires && questionnaires.length) {
            return questionnaires[0]
          }
          const newRecord = new UserQuestionnaire({questionnaireId, userId})
          return newRecord.save().then(() => newRecord)
        }
      )
    }
  },

  questionnairePromise: {
    get (val) {
      return val || Questionnaire.get({_id: route.data.itemId})
    }
  },
  questionnaire: {
    get (val, resolve) {
      if (val) {
        return val
      }
      const _id = route.data.itemId
      this.questionnairePromise.then(resolve)
    }
  },
  questions: {
    get () {
      return this.questionnaire ? this.questionnaire.questions : []
    }
  },
  // combines the questions and answers in a format the UI finds convenient
  displayData: {
    get (val, resolve) {
      if (val) {
        return val
      }
      Promise.all([
        this.userQuestionnairePromise,
        this.questionnairePromise
      ]).then((promiseResults) => {
        if (this.questions) {
          resolve (promiseResults[0].answers.map((userAnswer, index) => {
            console.log(promiseResults[0])
            const question = this.questions[index]
            if (!userAnswer) {
              return {
                question,
                answer: {
                  selection: question.questionType === 'SINGLE' ? null : [null],
                  custom: null
                }
              }
            } else {
              let selection
              let custom
              if (question.questionType === 'SINGLE') {
                const answerIndex = question.answerOptions.findIndex(ans => ans.answer === userAnswer)
                if (answerIndex === -1) {
                  selection = question.answerOptions.indexOf('CUSTOM')
                  custom = userAnswer
                } else {
                  selection = answerIndex
                  custom = null
                }
              } else {
                selection = userAnswer.map(selectedAnswer => question.answerOptions.findIndex(ans => ans.answer === selectedAnswer))
                const customIndex = selection.indexOf(-1)
                if (customIndex === -1) {
                  custom = null
                } else {
                  custom = userAnswer[customIndex]
                  selection[customIndex] = question.answerOptions.indexOf('CUSTOM')
                }
              }
              return {
                question,
                answer: {
                  selection,
                  custom
                }
              }
            }
          }))
        }
      })
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

  selectCustom (answer, num) {
    if (answer.selection && answer.selection.indexOf) {
      if (answer.selection.indexOf(num) === -1) {
        answer.selection.push(num)
      }
    } else {
      answer.selection = num
    }
  }
})

export default Component.extend({
  tag: 'page-questionnaire',
  ViewModel,
  view
})
