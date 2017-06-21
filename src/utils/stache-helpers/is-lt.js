import stache from 'can-stache';

stache.registerHelper('is-lt', function (a, b) {
  return a < b;
});

stache.registerHelper('is-gt', function (a, b) {
  return a > b;
});

stache.registerHelper('sum', function (a, b) {
  return a + b;
});

stache.registerHelper('subtract', function (a, b) {
  return a - b;
});
