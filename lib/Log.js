var config = require('./Config');
var log4js = require('log4js');
var _ = require('lodash');

log4js.configure({
  appenders: {
    out: { type: 'stdout'},
    app: { type: 'file', filename: config.get('logPath') + "/" + config.get('appId') + '.log',
      maxLogSize: 20485760, backups: 5, compress: false,
      layout: {
        type: 'pattern',
        pattern: '%d %p %c %X{user} %m%n'
      }}
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug' }
  }
});
const logger = log4js.getLogger();

var debug = function (message) {
  logger.debug.apply(logger,_.values(arguments));
}

var info = function (message) {
  logger.info.apply(logger,_.values(arguments));
}

var error = function (message) {
  logger.error.apply(logger,_.values(arguments));
}

module.exports = {
    debug: debug,
    info: info,
    error: error
}
