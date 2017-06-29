import connect from 'can-connect'
import dataParse from 'can-connect/data/parse/'
import construct from 'can-connect/constructor/'
import constructStore from 'can-connect/constructor/store/'
import constructOnce from 'can-connect/constructor/callbacks-once/'
import canMap from 'can-connect/can/map/'
import dataCallbacks from 'can-connect/data/callbacks/'
import realtime from 'can-connect/real-time/'
import feathersBehavior from 'can-connect-feathers/service'

import algebra from '~/models/algebra'
import memoryCache from 'can-connect/data/memory-cache/memory-cache'
import cacheRequests from 'can-connect/cache-requests/cache-requests'
import callbacksCache from 'can-connect/data/callbacks-cache/callbacks-cache'

const superModel = function (options, optionBehaviors = []) {
  var cacheConnection = connect([
    memoryCache
  ], { algebra })

  const behaviors = [
    feathersBehavior,
    dataParse,
    cacheRequests,
    construct,
    constructStore,
    constructOnce,
    canMap,
    realtime,
    callbacksCache,
    dataCallbacks,
    ...optionBehaviors
  ]

  options.cacheConnection = cacheConnection

  return connect(behaviors, options)
}

// Note: avoid caching if custom querying is needed till the following issue gets resolved:
// https://github.com/canjs/can-set/issues/58
const superModelNoCache = function (options, optionBehaviors = []) {
  const behaviors = [
    feathersBehavior,
    dataParse,
    construct,
    constructStore,
    constructOnce,
    canMap,
    realtime,
    callbacksCache,
    dataCallbacks,
    ...optionBehaviors
  ]
  return connect(behaviors, options)
}

export default superModel

export { superModelNoCache }
