import stache from 'can-stache';

stache.registerHelper('oneOf', function() {
  var [input, ...args] = arguments;
	return [...args].reduce((sum, operand) => {
		return !!sum || input === operand;
	}) ? input : false;
});
