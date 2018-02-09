import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import feathersClient from './feathers-client'
import superModel from './super-model'
import algebra from './algebra'
import Session from './session'

const Company = DefineMap.extend('Company', {
  requiredFields: ['name', 'domicile', 'registrationNumber']
}, {
  _id: 'string',
  userId: 'string',
  index: 'number',

  // Legal name:
  name: 'string',
  slug: 'string',

  // Registration Number:
  registrationNumber: 'string',

  // Jurisdiction (Country):
  domicile: 'string',

  // Jurisdiction (State/Province):
  state: 'string',

  error: {
    type: 'string',
    serialize: false
  },

  validateAndSave () {
    this.error = ''
    if (!this.userId && Session.current && Session.current.user) {
      this.userId = Session.current.user._id
    }
    if (this.hasErrors()) {
      this.error = this.validationError
      return Promise.reject(new Error(this.error))
    }
    return this.save()
  },

  hasErrors () {
    return Company.requiredFields.reduce((acc, prop) => (acc || !this[prop]), false)
  },

  validationError: {
    get () {
      return Company.requiredFields.reduce((acc, prop) => (acc || (!this[prop] && `${prop} is required`)), '')
    }
  }
})

Company.List = DefineList.extend('CompanyList', {
  '#': Company
})

Company.connection = superModel({
  Map: Company,
  List: Company.List,
  feathersService: feathersClient.service('/companies'),
  name: 'companies',
  algebra
})

Company.algebra = algebra

export default Company
