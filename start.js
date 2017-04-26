const feathers = require('feathers');
const path = require('path');
const host = process.env.VIRTUAL_HOST || process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 8080;
const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');

const app = feathers();

// Host the public folder
app.use('/', feathers.static('./'));
app.get('*', function (req, res, next) {
  const requestedUrl = path.parse(req.url);
  // allow: /test?email=user@gmail.com
  // skip: /image.png
  if (!requestedUrl.ext || requestedUrl.name.includes('?')) {
    return res.sendFile(path.join(__dirname, './production.html'));
  }
  return next();
});

app.use(notFound());
app.use(handler());

const server = app.listen(port);
process.on('unhandledRejection', (reason, p) =>
  console.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  console.info(`Equibit Wallet UI application started on ${host}:${port}`)
);
