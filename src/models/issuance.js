import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';

const Issuance = DefineMap.extend('Issuance', {
  _id: 'string',
  company: 'string',
  domicile: 'string',
  issuance: 'string',
  issuanceType: 'string',
  restriction: 'string',
  marketCap: 'number',
  changeBtc: 'number',
  changePercentage: 'number'
});

Issuance.List = DefineList.extend('IssuanceList', {
  '#': Issuance
});

Issuance.connection = superModel({
  Map: Issuance,
  List: Issuance.List,
  feathersService: feathersClient.service('/issuances'),
  name: 'issuances',
  algebra
});

Issuance.algebra = algebra;

export default Issuance;
