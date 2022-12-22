/* eslint-disable no-multi-assign */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */

// const { CONFIG_NAMES } = require('../config/constants');
// const { getConfigurationsList } = require('../methods/configuration');
// const { encrypt } = require('./encryption');
const logger = require('./logger');

/* eslint-disable vars-on-top */
const ResponsePayload = function (code, payload) {
  this.code = code;
  this.payload = payload;
};

exports.respondWithCode = function (code, payload) {
  return new ResponsePayload(code, payload);
};

const writeJson = (exports.writeJson = async function (response, arg1, arg2) {
  let code;
  let payload;

  if (arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  if (arg2 && Number.isInteger(arg2)) {
    code = arg2;
  } else if (arg1 && Number.isInteger(arg1)) {
    code = arg1;
  }
  if (code && arg1) {
    payload = arg1;
  } else if (arg1) {
    payload = arg1;
  }

  if (!code) {
    // if no response code given, we default to 200
    code = 200;
  }
  if (typeof payload === 'object') {
    // if (code === 200) {
    //   payload.configurations = await getConfigurationsList();

    //   const configObj = payload.configurations.find(
    //     each => each.configName === CONFIG_NAMES.ENCRYPT_RESPONSE,
    //   );
    //   if (configObj && configObj.configValue === '1') {
    //     payload = {
    //       fslEncryptedData: encrypt(JSON.stringify(payload)),
    //     };
    //   }
    // }

    logger.debug({
      responseTime: response.locals.startTime
        ? Date.now() - new Date(response.locals.startTime) : 0,
      responseCode: code,
      ...response.locals,

    });
    payload = JSON.stringify(payload, null, 2);
  }
  if (!response.headersSent) {
    response.writeHead(code, { 'Content-Type': 'application/json' });
    response.end(payload);
  }
});
