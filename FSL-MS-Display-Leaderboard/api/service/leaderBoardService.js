/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable import/order */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
// eslint-disable-next-line max-len
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-unused-expressions
// eslint-disable-next-line no-console
// eslint-disable-next-line no-console
// eslint-disable-next-line no-undef
const { getFSLRedis } = require('../../../FSL-Backend-Common/redis/redisProvider');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const {
  INTERNAL_ERROR, SUCCESS, NOT_FOUND,
} = require('../../../FSL-Backend-Common/config/status-codes');
const {
  FOUND_SUCCESS, NO_CONTEST_LEADERBOARD_FOUND,
} = require('../../../FSL-Backend-Common/config/strings');
const RedisClient = getFSLRedis()
/**
 * Function Name: getContestLeaderBoard
 * Description: Returns all the fantasy team Id and their points  for a particular contest in the decending order
 * @param {params} params 
 * @returns 
 * 
 * Exceptions: Throws Not found exeption if the given contest Id is invalid
 * - 
 */
exports.getContestLeaderBoard = params => new Promise(async (resolve, reject) => {
  try {
    const startTime=Date.now();
    const result=await RedisClient.getAllZKeyValues(params);
  
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `ContestLeaderBoard Fetched BY ID ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (result && result.length>0) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          leaderBoard: result[0].reverse(),
        },
      });
    }
    resolve({
      status: NOT_FOUND,
      message: NO_CONTEST_LEADERBOARD_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getContestDetails', error, resourceType: 'ContestLeaderBoard' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
/**
 * Function Name: getFLPlayerLeaderBoard
 * Description: Returns all the player Id and their points  for a particular fantasy Team  in the decending order
 * @param {contest_id,fantasyteam_id} params 
 * @returns 
 * 
 * Exceptions: Throws Not found exeption if the given fantasy team Id is invalid or Server if any
 * - 
 */
exports.getFLPlayerLeaderBoard = params => new Promise(async (resolve, reject) => {
  try {
    const startTime=Date.now();
    
    let flPlayerLeaderBoardId=params.contest_id.value+"_"+params.fantasyteam_id.value;
    
    //redis method call to retrive all the data from Fantasy Player leader board 
    const result= await RedisClient.getAllZKeyValues(flPlayerLeaderBoardId);
    
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `PlayerLeaderBoard Fetched BY ID ${Date.now() - startTime} ms`,
    });

    // send response and perform in backgroud for caching
    if (result && result.length) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          leaderBoard: result[0].reverse(),
        },
      });
    }
    resolve({
      status: NOT_FOUND,
      message: '',
    });
  } catch (error) {
    logger.error(error, { methodName: 'getContestDetails', error, resourceType: 'ContestLeaderBoard' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

