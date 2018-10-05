const feathers = require('feathers')
const fs = require('fs')
const path = require('path')
const host = process.env.VIRTUAL_HOST || process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 8080
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const handler = require('feathers-errors/handler')
const notFound = require('feathers-errors/not-found')

const app = feathers()

// Forward http requests on heroku to https
app.use(function (req, res, next) {
  var herokuProtocol = req.headers['x-forwarded-proto']
  var host = req.headers['host']
  var isDevelopment = process.env.NODE_ENV === 'development'
  var isLocalhost = host.indexOf('localhost') !== -1

  if (!isDevelopment && !isLocalhost && herokuProtocol !== 'https') {
    res.redirect('https://' + host + req.url)
  } else {
    next()
  }
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(expressSession({
  secret: '49df-2395-98nb-d5f6',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.post('/basic-login', function (req, res) {
  if (!req.body.password) {
    res.send('login failed')
  } else if (req.body.password === process.env.HTTP_PASSWORD) {
    req.session.authorized = true
    res.redirect('/')
  }
})

app.use(function (req, res, next) {
  // Skip for CI.
  if (process.env.NODE_ENV !== 'testing' && !req.session.authorized) {
    return res.sendFile(path.join(__dirname, './basic-login.html'))
  }
  return next()
})

app.use('/', function (req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    const { dir, base } = path.parse(req.url)
    const localPath = path.join(__dirname, '/' + req.url)
    // Let other routes handle directory does not exist errors
    if (!fs.existsSync(localPath) || (dir === '/' && base === '')) {
      return next()
    }
    if (dir === '/' || dir.split('/')[1] !== 'dist') {
      return res.sendStatus(204)
    }
  }
  return next()
})

// Host the public folder
app.use('/', feathers.static('./'))
app.get('*', function (req, res, next) {
  var urlParts = path.parse(req.url)
  var isPushstateRoute = !urlParts.ext || urlParts.name.includes('?')
  if (isPushstateRoute) {
    var env = process.env.NODE_ENV || 'development'
    var htmlPath = path.join(__dirname, './' + env + '.html')
    if (!fs.existsSync(htmlPath)) {
      htmlPath = path.join(__dirname, './production.html')
    }
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath)
    }
  }
  return next()
})

app.use(notFound())
app.use(handler())

const server = app.listen(port)
process.on('unhandledRejection', (reason, p) =>
  console.error('Unhandled Rejection at: Promise ', p, reason)
)

server.on('listening', () =>
  console.info(`Equibit Wallet UI application started on ${host}:${port}`)
)
