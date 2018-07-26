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
  questionnaire: {
    get (val, resolve) {
      if (val) {
        return val
      }
      const _id = route.data.itemId
      Questionnaire.get({_id}).then(questionnaire => {
        resolve(questionnaire)
      })
      // return [
      //   /* 1 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb77a",
      //     "question" : "What best describes your interest in Equibit?",
      //     "sortIndex" : 1,
      //     "questionType" : "SINGLE",
      //     "answerOptions" : [
      //         "I just want the free EQB for completing this questionnaire <strong>[end]</strong>",
      //         "I’m interested in both investing and raising money for companies on the blockchain",
      //         "I’m only interested in using Equibit Portfolio to invest in companies",
      //         "I’m only interested in using Equibit Portfolio to raise money for companies <strong>[Goto Q8]</strong>"
      //     ]
      //   },

      //   /* 2 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb77b",
      //     "question" : "How likely are you to use Equibit Portfolio to invest in a company?",
      //     "sortIndex" : 2,
      //     "questionType" : "SINGLE",
      //     "answerOptions" : [
      //         "Unlikely <strong>[end]</strong>",
      //         "Somewhat likely",
      //         "Very likely",
      //         "Don’t know",
      //         "CUSTOM"
      //     ]
      //   },

      //   /* 3 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb77c",
      //     "question" : "What types of companies are you most interested investing in?",
      //     "sortIndex" : 3,
      //     "questionType" : "MULTI",
      //     "answerOptions" : [
      //         "Blockchain",
      //         "Fintech",
      //         "Cannabis",
      //         "Any Start-up",
      //         "Traditional/Blue chip",
      //         "Any",
      //         "Don’t know"
      //     ]
      //   },

      //   /* 4 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb77d",
      //     "question" : "Are you an “Accredited Investor? That is; do you earn more than $250,000 (USD)/year or have over $1,000,000 USD in liquid Assets or have a net worth of over $5,000,000",
      //     "sortIndex" : 4,
      //     "questionType" : "SINGLE",
      //     "answerOptions" : [
      //         "Yes",
      //         "No"
      //     ]
      //   },

      //   /* 5 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb77e",
      //     "question" : "What is the current approximate size of your investment portfolio (Both crypto and other)?",
      //     "sortIndex" : 5,
      //     "questionType" : "SINGLE",
      //     "answerOptions" : [
      //         "Let than one BTC",
      //         "Between 1 and 10 BTC",
      //         "More than 10 BYTC but less than 100 BTC",
      //         "More than 100 BTC"
      //     ]
      //   },

      //   /* 6 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb77f",
      //     "question" : "How would you describe your blockchain investment strategy?",
      //     "sortIndex" : 6,
      //     "questionType" : "MULTI",
      //     "answerOptions" : [
      //         "I buy and sell crypto currencies (ICOs and aftermarket)",
      //         "I buy and sell equity (shares) in crypto related business",
      //         "I look forward to using the EQB network and tools to invest in all manner of companies."
      //     ]
      //   },

      //   /* 7 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb780",
      //     "question" : "What features are important to you while selecting equities or assets for your portfolio?",
      //     "sortIndex" : 7,
      //     "questionType" : "SINGLE",
      //     "answerOptions" : [
      //         "Voting Rights (an investor Voice)",
      //         "Capital Gains (asset appreciation)",
      //         "Dividends",
      //         "Diversity",
      //         "CUSTOM",
      //         "Don’t know"
      //     ]
      //   },

      //   /* 8 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb781",
      //     "question" : "What language(s )are you most comfortable using or conducting business in?",
      //     "sortIndex" : 8,
      //     "questionType" : "MULTI",
      //     "answerOptions" : [
      //         "English",
      //         "Simplified Chinese",
      //         "French",
      //         "Spanish",
      //         "Hindi",
      //         "Korean",
      //         "CUSTOM"
      //     ]
      //   },

      //   /* 9 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb782",
      //     "question" : "What geographic regions (based on corporate head office address) are you interested in?",
      //     "sortIndex" : 9,
      //     "questionType" : "SINGLE",
      //     "answerOptions" : [
      //         "North America",
      //         "Europe",
      //         "Asia",
      //         "South America",
      //         "Australia",
      //         "Africa"
      //     ]
      //   },

      //   /* 10 */
      //   {
      //     "_id" : "5aefe55da6bac4e306feb783",
      //     "question" : "What county do you consider home?",
      //     "sortIndex" : 10,
      //     "questionType" : "DROPDOWN",
      //     "answerOptions" : [
      //         "COUNTRIES"
      //     ]
      //   }
      // ]
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
      if (this.questionnaire) {
        const questions = this.questions
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
