var express = require('express')
var logger = require('morgan')
var errorHandler = require('errorhandler')
var pgcache = require('koop-pgcache')
var app = express()
var koop = require('../')({
  db: {
    conn: 'postgres://localhost/koopdev'
  }
})

koop.register(pgcache)
app.set('port', process.env.PORT || 3000)
app.use(koop)

if (app.get('env') === 'production') {
  app.use(logger('combined'))
  app.use(errorHandler())
} else {
  app.use(logger('dev'))
  app.use(errorHandler({ dumpExceptions: true, showStack: true }))
}

app.listen(app.get('port'), function () {
  console.log('%s server listening at %s', app.get('env'), this.address().port)
})
