import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from '~/models/feathers-client';
import superModel from '~/models/super-model';
import algebra from '~/models/algebra';

const Market = DefineMap.extend('Market', {
  _id: 'string',
  newIssuances: 'number',
  volume: 'number',
  tradesNum: 'number',
  shareVolume: 'number'
});

Market.List = DefineList.extend('MarketList', {
  '#': Market
});

Market.connection = superModel({
  Map: Market,
  List: Market.List,
  feathersService: feathersClient.service('/market'),
  name: 'market',
  algebra
});

Market.algebra = algebra;

export default Market;
