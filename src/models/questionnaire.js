import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/'
import set from 'can-set'
import feathersClient from './feathers-client'
import algebra from './algebra'
import { superModelNoCache as superModel } from './super-model'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
// import behaviors from './behaviors'

export const Question = DefineMap.extend('Question', {
  questionaireId: 'string',
  question: 'string',
  sortIndex: 'number',
  //enum: ['SINGLE', 'MULTI', 'DROPDOWN']
  questionType: 'string',
  // Array of strings. `CUSTOM` is reserved for "Other - Specify" answers.
  answerOptions: 'any'
})
Question.List = DefineList.extend('QuestionList', {
  '#': Question
})

const Questionnaire = DefineMap.extend('Questionnaire', {
  seal: false
}, {
  '_id': 'any',
  description: 'string',
  // enum: ['active', 'closed']
  status: 'string',
  questions: Question.List,
  reward: 'number',
  createdAt: 'date'
})

Questionnaire.List = DefineList.extend('QuestionnaireList', {
  '#': Questionnaire
})

Questionnaire.connection = superModel({
  Map: Questionnaire,
  List: Questionnaire.List,
  feathersService: feathersClient.service('/questionnaires'),
  name: 'questionnaires',
  algebra
})
Questionnaire.algebra = algebra
export default Questionnaire