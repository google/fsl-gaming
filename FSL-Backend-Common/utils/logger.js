// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// TODO: High-level file comment.

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
