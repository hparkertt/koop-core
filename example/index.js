var express = require('express')
var logger = require('morgan')
var errorHandler = require('errorhandler')
var pgcache = require('koop-pgcache')
var gist = require('koop-gist')
var app = express()
var koop = require('../')({
  db: {
    conn: 'postgres://localhost/koopdev'
  }
})

koop.register(pgcache)
koop.register(gist)

app.set('port', process.env.PORT || 3000)
app.use('/koop', koop)

if (app.get('env') === 'production') {
  app.use(logger('combined'))
} else {
  app.use(logger('dev'))
  app.use(errorHandler())
}

app.listen(app.get('port'), function () {
  koop.log.info('%s server listening at %s', app.get('env'), this.address().port)
})
