import Component from 'can-component'
import DefineMap from 'can-define/map/'
import './page-questionnaires.less'
import view from './page-questionnaires.stache'
import Session from '../../models/session'
import Questionnaire from '../../models/questionnaire'

export const ViewModel = DefineMap.extend({
  user: {
    get (val) {
      return (Session.current && Session.current.user) || val
    }
  },
  questionnaires: {
    get (value, resolve) {
      if (value) {
        return value
      }
      Questionnaire.getList({ isActive: true }).then(qList => {
        resolve(qList.map(questionnaire => ({
          title: questionnaire.description,
          id: questionnaire._id
        })))
      })
    }
  }
})

export default Component.extend({
  tag: 'page-questionnaires',
  ViewModel,
  view
})
