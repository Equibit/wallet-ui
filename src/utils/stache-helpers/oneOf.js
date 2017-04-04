import stache from 'can-stache';

stache.registerHelper('oneOf', function() {
  var [input, ...args] = arguments;
  // Get rid of options that are passed as the last argument to a helper:
  args.pop();
	return [...args].reduce((sum, operand) => {
		return !!sum || input === operand;
	}, false) ? input : false;
});
