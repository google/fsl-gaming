

const logger = require('../utils/logger');


const envVariables = [
  'NODE_ENV',
  'PORT'
];

exports.checkEnvVariables = () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    envVariables.forEach((each) => {
      if (!process.env[each]) {
        logger.error(`${each} not set!`, {
          methodName: 'checkEnvVariables',
          resourceType: 'environmentCheck',
        });
      } else {
        logger.debug({
          [each]: process.env[each],
          methodName: 'checkEnvVariables',
          resourceType: 'environmentCheck',
        });
      }
    });
    return;
  } catch (error) {
    logger.error(error, { methodName: 'checkEnvVariables', error, resourceType: 'environmentCheck' });
  }
};
