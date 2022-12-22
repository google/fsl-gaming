/* eslint-disable no-nested-ternary */
const winston = require('winston');

const { combine, timestamp, errors } = winston.format;

/*
@ myFormat
  Desc : To have the Date and Time stamp in loggin file in each logs
*/
const myFormat = winston.format.printf(
  // eslint-disable-next-line max-len
  info => ((typeof info.message === 'object') ? JSON.stringify({
    ...info.message,
    level: info.level,
    timestamp: info.timestamp,
    error: info.error ? (info.error.message ? info.error.message : info.error) : undefined,
  })
    : JSON.stringify(info)),
);
const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    errors({ stack: true }), // <-- use errors format
    myFormat,
  ),

  transports: [

    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true,
    }),
  ],

  exitOnError: false,
});


module.exports = logger;
module.exports.stream = {
  write(message) {
    logger.info(message);
  },
};
