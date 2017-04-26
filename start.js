const feathers = require('feathers');
const path = require('path');
const host = process.env.VIRTUAL_HOST || process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');

const app = feathers();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({
  secret: '49df-2395-98nb-d5f6',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.post('/basic-login', function (req, res) {
  if (!req.body.password) {
    res.send('login failed');
  } else if (req.body.password === process.env.HTTP_PASSWORD) {
    req.session.authorized = true;
    res.redirect('/');
  }
});

app.use(function (req, res, next) {
  if (!req.session.authorized) {
    return res.sendFile(path.join(__dirname, './basic-login.html'));
  }
  return next();
});

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
