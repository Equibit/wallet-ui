import stache from 'can-stache';

stache.registerHelper('is-lt', function (value) {
  return value < 0;
});

stache.registerHelper('is-gt', function (value) {
  return value > 0;
});
