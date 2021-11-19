const { createLogger, format, transports } = require('winston');
const config = require('../config');

const {
  combine,
  timestamp,
  printf
} = format;

/* istanbul ignore next */
const level = config.log.level;

const myFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console({ level }),
    new transports.File({
      filename: 'my_log.log',
      level
    })
  ]
});

logger.info(`logger created with log level ${level}`);

module.exports = logger;
