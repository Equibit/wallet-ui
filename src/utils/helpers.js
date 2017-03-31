import stache from 'can-stache';

stache.registerHelper('validation-message', function (message) {
  return message && '<small class="form-text text-muted">${{message}}</small>';
});