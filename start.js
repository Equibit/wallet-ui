const server = require('pushstate-server');
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 8080;

server.start({
  port,
  host,
  directory: './'
});

console.log(`Web server started on http://${host}:${port}`);
