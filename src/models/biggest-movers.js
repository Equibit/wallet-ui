import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';

const BiggestMovers = DefineMap.extend('BiggestMovers', {
  _id: 'string',
  companyName: 'string',
  change: 'number',
  changePercent: 'number'
});

BiggestMovers.List = DefineList.extend('BiggestMovers', {
  '#': BiggestMovers
});

BiggestMovers.connection = superModel({
  Map: BiggestMovers,
  List: BiggestMovers.List,
  feathersService: feathersClient.service('/biggest-movers'),
  name: 'biggest-movers',
  algebra
});

BiggestMovers.algebra = algebra;

export default BiggestMovers;
