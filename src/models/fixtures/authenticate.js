import fixture from 'can-fixture';

fixture('POST /authentication', (request, response, headers, ajaxSettings) => {
  response(200, {
    isNewAccount: true
  });
});