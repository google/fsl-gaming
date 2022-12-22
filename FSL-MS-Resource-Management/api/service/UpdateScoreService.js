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
/* eslint-disable no-multi-assign */
// eslint-disable-next-line max-len
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-unused-expressions
// eslint-disable-next-line no-console
// eslint-disable-next-line no-console
// eslint-disable-next-line no-undef

const {
  INTERNAL_ERROR, SUCCESS,
} = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { runSelect } = require('../../../FSL-Backend-Common/database/spanner');
const pubsubService = require('../../../FSL-Backend-Common/utils/pubsub');
const {
  SAVE_SUCCESS,
} = require('../../../FSL-Backend-Common/config/strings');


/**
 * Function Name: updateScore
 * Description: Returns the Updated Score
 * @param { matchUuid, playerUuid, points} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid  matchUuid, playerUuid
 * -
 */
exports.updateScore = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { queryData, points,overCount } = params;

    
    let result = await runSelect(`SELECT contestLeaderUuid, contestUuid, fantasyTeamUuid, isCaptain, isVCaptain, playerUuid, matchUuid, points FROM ContestLeaderboard WHERE matchUuid=@matchUuid AND playerUuid=@playerUuid ORDER BY contestLeaderUuid LIMIT ${queryData.limitValue} OFFSET ${queryData.offsetValue} `, {
      matchUuid:queryData.matchUuid,
      playerUuid:queryData.playerUuid,
    }).catch(error =>{
      logger.error({ methodName: 'updateScore', error, resourceType: 'UpdateScore/Resource Management' })
      reject({
        status:INTERNAL_ERROR
      })
    });

    logger.debug({
      message: `No of Results to Update in Redis and Spanner - ${result.length}`
    });

    let packet = {};
    let count = 0;
    let appendList = [];
    result.forEach((res) => {
      appendList.push(res);
      count += 1;
      if (count === 400) {
        count = 0;
        packet = {};
        packet.topic = 'updateRedis';
        packet.data = appendList;
        packet.overCount = overCount;
        packet.score = points;
        pubsubService.publishMessage(packet);
        appendList = [];
      }
    });
    
    if (appendList.length > 0) {
      packet.topic = 'updateRedis';
      packet.data = appendList;
      packet.score = points;
      pubsubService.publishMessage(packet);
    }

    resolve({
      status: SUCCESS,
      message: SAVE_SUCCESS,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getAllPlayers', error, resourceType: 'player' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
