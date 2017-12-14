import stache from 'can-stache'

/**
 * Usage:
 * ```
 * {{#if one-of(value, "foo", "bar")}}OK{{/if}}
 * ```
 */
stache.registerHelper('one-of', function () {
  var [input, ...args] = arguments
  // Get rid of options that are passed as the last argument to a helper:
  args.pop()
  return [...args].reduce((sum, operand) => {
    return !!sum || input === operand
  }, false) ? input : false
})
