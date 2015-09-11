var winston = require('winston')
winston.emitErrs = true

/**
 * creates new custom winston logger
 *
 * @param {object} config - koop configuration
 * @return {Logger} custom logger instance
 */
function createLogger (config) {
  if (!config.logfile) {
    // no logfile defined, log to console only
    var debugConsole = new winston.transports.Console({
      timestamp: true,
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
    var logger = new winston.Logger({ transports: [debugConsole], exitOnError: false })

    logger.stream = {
      write: function (message, encoding) {
        logger.debug(message.replace(/\n$/, ''))
      }
    }

    return logger
  }

  // we need a dir to do log rotation so we get the dir from the file
  var logpath = config.logfile.split('/').slice(-1, 1).join('/')
  var logAll = new winston.transports.DailyRotateFile({
    filename: config.logfile,
    name: 'log.all',
    dirname: logpath,
    datePattern: '.yyyy-MM-dd',
    colorize: true,
    json: false,
    level: 'debug',
    formatter: formatter
  })
  var logError = new winston.transports.DailyRotateFile({
    filename: config.logfile + '.error',
    name: 'log.error',
    dirname: logpath,
    datePattern: '.yyyy-MM-dd',
    colorize: true,
    json: false,
    level: 'error',
    formatter: formatter
  })

  return new winston.Logger({ transports: [logAll, logError], exitOnError: false })
}

/**
 * formats winston log lines
 * @param {object} options - log info from winston
 * @return {string} formatted log line
 */
function formatter (options) {
  var line = [
    new Date().toISOString(),
    options.level
  ]

  if (options.message !== undefined) {
    line.push(options.message)
  }

  if (options.meta && Object.keys(options.meta).length) {
    line.push(JSON.stringify(options.meta))
  }

  return line.join(' ')
}

module.exports = createLogger
