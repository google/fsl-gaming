const { INTERNAL_ERROR, SUCCESS } = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { getFSLRedis } = require('../../../FSL-Backend-Common/redis/redisProvider');;
const RedisService = getFSLRedis()

exports.clearRedis = () =>
  new Promise(async (resolve, reject) => {
    try {

        await RedisService.flushRedis()

      resolve({
        status: SUCCESS,
        message: 'DB Flushed'
      });
    
  } catch (error) {
    logger.error(error, {
      methodName: 'getAllContestLeaderboard',
      error,
      resourceType: 'ContestLeaderboard',
    });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
