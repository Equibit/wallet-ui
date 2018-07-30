import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/'
import set from 'can-set'
import feathersClient from './feathers-client'
import algebra from './algebra'
import { superModelNoCache as superModel } from './super-model'
import feathersServiceBehavior from 'can-connect-feathers/service/service'
// import behaviors from './behaviors'

export const UserQuestionnaire = DefineMap.extend('userQuestionnaire', {
  questionaireId: 'string',
  status: 'string',
  // string or string array
  answers: 'any'
})

UserQuestionnaire.List = DefineList.extend('userQuestionnaireList', {
  '#': UserQuestionnaire
})

UserQuestionnaire.connection = superModel({
  Map: UserQuestionnaire,
  List: UserQuestionnaire.List,
  feathersService: feathersClient.service('/user-questionnaire'),
  name: 'user-questionnaires',
  algebra
})
UserQuestionnaire.algebra = algebra
export default UserQuestionnaire