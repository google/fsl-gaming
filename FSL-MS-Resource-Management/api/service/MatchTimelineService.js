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


const { v4: uuidv4 } = require('uuid');
const { INTERNAL_ERROR, SUCCESS, NOT_FOUND } = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const {
  mutateInsert, runSelect, mutateUpdate, Spanner,
} = require('../../../FSL-Backend-Common/database/spanner');
/* eslint-disable no-multi-assign */

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');

// const RedisServer = getFSLResourceManagement();

// const { REDIS_BUCKET } = require('../../../FSL-Backend-Common/config/constants');

const {
  SAVE_SUCCESS, FOUND_SUCCESS, INVALID_MATCH_ID, INVLID_MATCHTIMELNE_ID,
} = require('../../../FSL-Backend-Common/config/strings');

/**
 * Function Name: createMatchTimeline
 * Description:  Creates the MatchTimeline
 * @param {matchUuid, batsmanUuid, bowlerUuid, over_count, ball_count, score, hasLostWicket, wicketType, batsmanOutUuid, hasExtra, extraType} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchUuid, batsmanUuid, bowlerUuid, batsmanOutUuid
 * -
 */
exports.createMatchTimeline = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const matchTimelineUuid = uuidv4();
    const {
      matchUuid, batsmanUuid, bowlerUuid, over_count, ball_count, score, hasLostWicket, wicketType, batsmanOutUuid, hasExtra, extraType,
    } = params;
    const createdTS = new Date();
    // let error = '';
    // const [matchId, batsmanId, bowlerId] = await Promise.all([
    //   runSelect('SELECT matchUuid from MatchDetails WHERE matchUuid=@matchUuid', {
    //     matchUuid,
    //   }),
    //   runSelect('SELECT playerUuid from PlayerDetails WHERE playerUuid=@batsmanUuid', {
    //     batsmanUuid,
    //   }),
    //   runSelect('SELECT playerUuid from PlayerDetails WHERE playerUuid=@bowlerUuid', {
    //     bowlerUuid,
    //   }),
    // ]);
    // if (!(Array.isArray(matchId) && matchId.length)) {
    //   error = 'matchUuid';
    // }
    // if (!(Array.isArray(batsmanId) && batsmanId.length)) {
    //   error += error ? ' && batsmanUuid' : 'batsmanUuid';
    // }
    // if (!(Array.isArray(bowlerId) && bowlerId.length)) {
    //   error += error ? ' && bowlerUuid' : 'bowlerUuid';
    // }
    const MatchTimelineData = {
      matchTimelineUuid,
      matchUuid,
      batsmanUuid,
      bowlerUuid,
      over_count,
      ball_count,
      score,
      hasLostWicket,
      batsmanOutUuid,
      wicketType,
      hasExtra,
      extraType,
      createdTS,
    };
    // if (!error) {
      // try {
        await mutateInsert('MatchTimeline', MatchTimelineData)
        .catch((error) =>{
          logger.error({ methodName: 'createMatchTimeline', error, resourceType: 'MatchTimeline' })
          reject({
            status:INTERNAL_ERROR
          })
          });
        // await RedisServer.setRedisKey(matchTimelineUuid, JSON.stringify(MatchTimelineData), REDIS_BUCKET.MATCH_TIMELINE);
        logger.debug({
          benchMark: false,
          responseTime: `${Date.now() - startTime}`,
          message: `MatchTimeline Insert took ${Date.now() - startTime} ms`,
        });
        resolve({
          status: SUCCESS,
          message: SAVE_SUCCESS,
          data: {
            matchTimelineUuid,
            matchUuid,
            batsmanUuid,
            bowlerUuid,
            batsmanOutUuid,
            over_count,
            ball_count,
            score,
            hasLostWicket,
            wicketType,
            hasExtra,
            extraType,
          }
        });
      // } 
      // catch (err) {
      //   reject({
      //     status: NOT_FOUND,
      //     message: NOT_FOUND,
      //   });
      // }
      // send response and perform in backgroud for caching
    // }
  //   reject({
  //     status: NOT_FOUND,
  //     message: `${error} is invalid `,
  //   });
  } catch (error) {
    logger.error(error, { methodName: 'createMatchTimeline', error, resourceType: 'MatchTimeline' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getMatchTimelineByMatchID
 * Description: Returns Creates the getMatchTimelineByMatchID
 * @param {matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchUuid
 * -
 */
exports.getMatchTimelineByMatchID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let matchTimelineRecord = [];
    // matchTimelineRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.MATCH_TIMELINE);
    // matchTimelineRecord = JSON.parse(matchTimelineRecord);
    // if (!matchTimelineRecord) {
    matchTimelineRecord = await runSelect('SELECT matchTimelineUuid, matchUuid, batsmanUuid, bowlerUuid, over_count, ball_count, score, hasLostWicket, batsmanOutUuid, wicketType, hasExtra, extraType from MatchTimeline WHERE matchUuid=@matchUuid', {
      matchUuid: params,
    }).catch((error) =>{
      logger.error({ methodName: 'getMatchTimelineByMatchID', error, resourceType: 'MatchTimeline' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // if (Array.isArray(matchTimelineRecord) && matchTimelineRecord.length) {
    // matchTimelineRecord = matchTimelineRecord[0];
    // await RedisServer.setRedisKey(params, JSON.stringify(matchTimelineRecord), REDIS_BUCKET.MATCH_TIMELINE);
    //   }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Match Details Fethched BY ID ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(matchTimelineRecord) && matchTimelineRecord.length)) {
    // if ((Array.isArray(matchTimelineRecord) && matchTimelineRecord.length) || (matchTimelineRecord && Object.keys(matchTimelineRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          MatchTimeline: matchTimelineRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_MATCH_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getMatchByID', error, resourceType: 'match' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: updateMatchTimeline
 * Description: Returns Updates the MatchTimeline
 * @param {matchTimelineUuid, over_count, ball_count, score, hasLostWicket, hasExtra} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchTimelineUuid
 * -
 */
exports.updateMatchTimeline = (id, params) => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const {
      over_count, ball_count, score, hasLostWicket, hasExtra,
    } = params;
    // let matchTimelineDetails = await RedisServer.getRedisKey(id, REDIS_BUCKET.MATCH_TIMELINE);
    // matchTimelineDetails = JSON.parse(matchTimelineDetails);
    // matchTimelineDetails.over_count = over_count;
    // matchTimelineDetails.ball_count = ball_count;
    // matchTimelineDetails.score = score;
    // matchTimelineDetails.hasLostWicket = hasLostWicket;
    // matchTimelineDetails.hasExtra = hasExtra;
    const matchTimelineRecord = await runSelect('SELECT matchTimelineUuid from MatchTimeline WHERE matchTimelineUuid =@matchTimelineUuid', {
      matchTimelineUuid: id,
    }).catch((error) =>{
      logger.error({ methodName: 'updateMatchTimeline', error, resourceType: 'MatchTimeline' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // if (Array.isArray(matchTimelineRecord) && matchTimelineRecord.length) {
    await mutateUpdate('MatchTimeline', {
      matchTimelineUuid: id,
      over_count,
      ball_count,
      score,
      hasLostWicket,
      hasExtra,
    }).catch((error) =>{
      logger.error({ methodName: 'updateMatchTimeline', error, resourceType: 'MatchTimeline' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // await RedisServer.setRedisKey(id, JSON.stringify(matchTimelineDetails), REDIS_BUCKET.MATCH_TIMELINE);
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `MatchTimeline update took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    resolve({
      status: SUCCESS,
      message: SAVE_SUCCESS,
      data: {
        over_count,
        ball_count,
        score,
        hasLostWicket,
        hasExtra,
      },
    });
    // }
    reject({
      status: NOT_FOUND,
      message: INVLID_MATCHTIMELNE_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'updatePlayer', error, resourceType: 'player' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
