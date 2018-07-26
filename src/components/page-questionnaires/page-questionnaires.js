import Component from 'can-component'
import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/'
import value from 'can-value'
import './page-questionnaires.less'
import view from './page-questionnaires.stache'
import Session from '../../models/session'
// import Answer from '../../models/answer'
import Questionnaire, { Question } from '../../models/questionnaire'
// import questionStore from '../../models/fixtures/questions'

export const ViewModel = DefineMap.extend({
  user: {
    get (val) {
      return (Session.current && Session.current.user) || val
    }
  },
  questionnaires: {
    get () {
      return [1, 2, 3, 4]
    }
  },
})

export default Component.extend({
  tag: 'page-questionnaires',
  ViewModel,
  view
})
