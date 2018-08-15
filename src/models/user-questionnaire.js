import DefineMap from 'can-define/map/'
import DefineList from 'can-define/list/'
import feathersClient from './feathers-client'
import algebra from './algebra'
import { superModelNoCache as superModel } from './super-model'
// import behaviors from './behaviors'

const UserQuestionnaire = DefineMap.extend(
  'UserQuestionnaire',
  {
    questionnaireId: 'string',
    address: 'string',
    answers: {
      Type: DefineList
    },
    status: 'string',
    // unused but required for saving to be successful
    createdAt: 'any',
    error: 'any',
    locked: 'any',
    updatedAt: 'any',
    userId: 'any',
    __v: 'any',
    _id: 'any'
  }

  // status: 'string', // never set from the client side but required for successful creation
  // userId: 'string', // never set from the client side but required for successful creation
  // _id: 'string', // never set from the client side but required for successful creation
  // locked: 'string', // never set from the client side but required for successful creation
  // createdAt: 'string', // never set from the client side but required for successful creation
  // updatedAt: 'string', // never set from the client side but required for successful creation
  // __v: 'string', // never set from the client side but required for successful creation
)

UserQuestionnaire.connection = superModel({
  Map: UserQuestionnaire,
  feathersService: feathersClient.service('/user-questionnaire'),
  name: 'user-questionnaire',
  algebra
})
UserQuestionnaire.algebra = algebra
export default UserQuestionnaire
