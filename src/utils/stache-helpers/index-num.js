import stache from 'can-stache'

stache.registerHelper('%indexNum', function (options) {
  return options.scope.get('%index') + 1
})
