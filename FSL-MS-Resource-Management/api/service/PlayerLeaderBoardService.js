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
/* eslint no-shadow: "off" */

const { v4: uuidv4 } = require('uuid');
const { INTERNAL_ERROR, SUCCESS, NOT_FOUND } = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const {
  mutateInsert, runSelect, mutateUpdate, Spanner,
} = require('../../../FSL-Backend-Common/database/spanner');
const { points } = require('../../../FSL-Backend-Common/config/constants');
/* eslint-disable no-multi-assign */
const { getFSLRedis } = require('../../../FSL-Backend-Common/redis/redisProvider');

const RedisServer = getFSLRedis();


const {
  SAVE_SUCCESS, FOUND_SUCCESS, INVALID_PLAYERLEADERBOARD_ID, INVALID_PLAYER_ID, INVALID_MATCH_ID, NO_PLAYERLEADERBOARD_FOUND,
} = require('../../../FSL-Backend-Common/config/strings');
const { createPlaying11 } = require('./ContestService');

/**
 * Function Name: createPlayerLeaderboardBulk
 * Description: Returns Creates the PlayerLeaderboardBulk by passing matchUuid
 * @param {matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchUuid
 * -
 */
exports.createPlayerLeaderboardBulk = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { matchUuid } = params;
    const get11 = await createPlaying11(params);
    const { team1, team2 } = get11.data;
    const totalPlayers = team1.concat(team2);
    const createdTS = new Date();
    const lastUpdatedTS = new Date();
    let playerUuid;
    // let error = '';
    const [playerId] = await Promise.all([
      // runSelect('SELECT matchUuid from MatchDetails WHERE matchUuid=@matchUuid', {
      //   matchUuid,
      // }),
      runSelect('SELECT playerUuid from PlayerLeaderboard WHERE matchUuid=@matchUuid', {
        matchUuid,
      }),
    ]).catch((error) =>{
      logger.error({ methodName: 'createPlayerLeaderboardBulk', error, resourceType: 'PlayerleaderBoard' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // if (!(Array.isArray(matchId) && matchId.length)) {
    //   error += error ? ' && matchUuid' : 'matchUuid';
    // }
    // if (error) {
    //   reject({
    //     status: NOT_FOUND,
    //     message: `${error} not found`,
    //   });
    // }
    let playerLeaderboardUuid;
    if (playerId && playerId.length < totalPlayers.length) {
      await Promise.all(totalPlayers.map(async (player) => {
        playerLeaderboardUuid = uuidv4();
        // { playerUuid } = player.playerUuid;
        await mutateInsert('PlayerLeaderboard', {
          playerLeaderboardUuid: uuidv4(),
          playerUuid: player.playerUuid,
          matchUuid,
          points: Spanner.float(parseFloat(points)),
          createdTS: new Date(),
          lastUpdatedTS: new Date(),
        }).catch((error) =>{
          logger.error({ methodName: 'createPlayerLeaderboardBulk', error, resourceType: 'PlayerleaderBoard' })
          reject({
            status:INTERNAL_ERROR
          })
          });
        logger.debug({
          benchMark: false,
          responseTime: `${Date.now() - startTime}`,
          message: `PlayerLeaderboard Insert took ${Date.now() - startTime} ms`,
        });
      }));
      // send response and perform in backgroud for caching
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          playerLeaderboardUuid,
          playerUuid,
          matchUuid,
          points,
          createdTS,
          lastUpdatedTS,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: 'already 22 players in this matchUuid ',
    });
  } catch (error) {
    logger.error(error, { methodName: 'createPlayerLeaderboardBulk', error, resourceType: 'PlayerLeaderboard' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: createPlayerLeaderboard
 * Description: Returns Creates the PlayerLeaderboard by passing playerUuid and matchUuid
 * @param {playerUuid, matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid playerUuid, matchUuid
 * -
 */
exports.createPlayerLeaderboard = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const playerLeaderboardUuid = uuidv4();
    const { playerUuid, matchUuid } = params;
    const createdTS = new Date();
    const lastUpdatedTS = new Date();
    let error = '';
    const [playerId, matchId] = await Promise.all([
      runSelect('SELECT playerUuid from PlayerDetails WHERE playerUuid=@playerUuid', {
        playerUuid,
      }),
      runSelect('SELECT matchUuid from MatchDetails WHERE matchUuid=@matchUuid', {
        matchUuid,
      }),
    ]).catch((error) =>{
      logger.error({ methodName: 'createPlayerLeaderboard', error, resourceType: 'PlayerleaderBoard' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    if (!(Array.isArray(playerId) && playerId.length)) {
      error = 'playerUuid ';
    }
    if (!(Array.isArray(matchId) && matchId.length)) {
      error += error ? ' && matchUuid' : 'matchUuid';
    }
    if (!error) {
      await mutateInsert('PlayerLeaderboard', {
        playerLeaderboardUuid,
        playerUuid,
        matchUuid,
        points: Spanner.float(parseFloat(points)),
        createdTS,
        lastUpdatedTS,
      }).catch((error) =>{
        logger.error({ methodName: 'createPlayerLeaderboard', error, resourceType: 'PlayerleaderBoard' })
        reject({
          status:INTERNAL_ERROR
        })
        });
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `PlayerLeaderboard Insert took ${Date.now() - startTime} ms`,
      });
      // send response and perform in backgroud for caching
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          playerLeaderboardUuid,
          playerUuid,
          matchUuid,
          points,
          createdTS,
          lastUpdatedTS,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: `${error} not found`,
    });
  } catch (error) {
    logger.error(error, {
      methodName: 'createPlayerLeaderboard',
      error,
      resourceType: 'PlayerLeaderboard',
    });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getAllPlayerLeaderboard
 * Description: Returns All the PlayerLeaderboard
 * @param {*} params
 * @returns
 *
 * Exceptions: None
 * -
 */
exports.getAllPlayerLeaderboard = () => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const playerLeaderboardRecord = await runSelect('SELECT playerLeaderboardUuid, playerUuid, matchUuid, points from PlayerLeaderboard')
    .catch((error) =>{
      logger.error({ methodName: 'getAllPlayerLeaderboard', error, resourceType: 'PlayerleaderBoard' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `PlayerLeaderboard Fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (playerLeaderboardRecord && playerLeaderboardRecord.length) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          PlayerLeaderboardCount: playerLeaderboardRecord.length,
          PlayerLeaderboard: playerLeaderboardRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_PLAYERLEADERBOARD_FOUND,
    });
  } catch (error) {
    logger.error(error, {
      methodName: 'getAllPlayerLeaderboard',
      error,
      resourceType: 'PlayerLeaderboard',
    });
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
exports.getPlayerLeaderboardByID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const result = await runSelect(
      'SELECT  playerLeaderboardUuid, playerUuid, matchUuid, points from PlayerLeaderboard WHERE playerLeaderboardUuid=@playerLeaderboardUuid',
      {
        playerLeaderboardUuid: params,
      },
    ).catch((error) =>{
      logger.error({ methodName: 'getPlayerLeaderboardByID', error, resourceType: 'PlayerleaderBoard' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `PlayerLeaderboard Fetched BY ID took ${Date.now()
        - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (result && result.length) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          playerLeaderboard: result,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_PLAYERLEADERBOARD_ID,
    });
  } catch (error) {
    logger.error(error, {
      methodName: 'PlayerLeaderboard',
      error,
      resourceType: 'PlayerLeaderboard',
    });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getPlayerLeaderboardByPlayerID
 * Description: Returns the PlayerLeaderboard
 * @param {playerUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid playerUuid
 * -
 */
exports.getPlayerLeaderboardByPlayerID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const playerLeaderboardDetails = await runSelect(
      'SELECT  playerLeaderboardUuid, playerUuid, matchUuid, points from PlayerLeaderboard WHERE playerUuid=@playerUuid',
      {
        playerUuid: params,
      },
    ).catch((error) =>{
      logger.error({ methodName: 'getPlayerLeaderboardByPlayerID', error, resourceType: 'PlayerleaderBoard' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `PlayerLeaderboard Fetched BY Player ID took ${Date.now()
        - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (playerLeaderboardDetails && playerLeaderboardDetails.length) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          playerLeaderboard: playerLeaderboardDetails,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_PLAYER_ID,
    });
  } catch (error) {
    logger.error(error, {
      methodName: 'PlayerLeaderboard',
      error,
      resourceType: 'PlayerLeaderboard',
    });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getPlayerLeaderboardByMatchID
 * Description: Returns the PlayerLeaderboard
 * @param {matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchUuid
 * -
 */
exports.getPlayerLeaderboardByMatchID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let playerLeaderboardDetails;
    playerLeaderboardDetails = await RedisServer.getAllZKeyValues('player');
    if (!playerLeaderboardDetails) {
      playerLeaderboardDetails = await runSelect(
        'SELECT  playerLeaderboardUuid, playerUuid, matchUuid, points from PlayerLeaderboard WHERE matchUuid=@matchUuid',
        {
          matchUuid: params,
        },
      ).catch((error) =>{
        logger.error({ methodName: 'getPlayerLeaderboardByMatchID', error, resourceType: 'PlayerleaderBoard' })
        reject({
          status:INTERNAL_ERROR
        })
        });
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `PlayerLeaderboard Fetched BY Match ID took ${Date.now()
          - startTime} ms`,
      });
    }
    // send response and perform in backgroud for caching
    if (playerLeaderboardDetails && playerLeaderboardDetails.length) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          playerLeaderboard: playerLeaderboardDetails,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_MATCH_ID,
    });
  } catch (error) {
    logger.error(error, {
      methodName: 'PlayerLeaderboard',
      error,
      resourceType: 'PlayerLeaderboard',
    });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: updatePlayerLeaderboardPoints
 * Description: Returns upadated the PlayerLeaderboardPoints
 * @param {playerUuid, matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid playerUuid, matchUuid
 * -
 */
exports.updatePlayerLeaderboardPoints = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { playerUuid, matchUuid, points } = params;
    let error = '';
    const playerId = await runSelect('SELECT  playerUuid from PlayerDetails WHERE playerUuid=@playerUuid', {
      playerUuid,
    }).catch((error) =>{
      logger.error({ methodName: 'updatePlayerLeaderboardPoints', error, resourceType: 'PlayerleaderBoard' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    const playerLeaderboardRecord = await runSelect('SELECT playerLeaderboardUuid,playerUuid,matchUuid,points from PlayerLeaderboard WHERE playerUuid=@playerUuid and matchUuid=@matchUuid', {
      playerUuid, matchUuid,
    }).catch((error) =>{
      logger.error({ methodName: 'updatePlayerLeaderboardPoints', error, resourceType: 'PlayerleaderBoard' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    if (!(playerId && playerId.length && playerLeaderboardRecord.length > 0)) {
      error = 'playerUuid or matchUuid';
    }
    if (!error) {
      await mutateUpdate('PlayerLeaderboard', {
        playerLeaderboardUuid: playerLeaderboardRecord[0].playerLeaderboardUuid,
        points: Spanner.float(parseFloat(playerLeaderboardRecord[0].points + points)),
      }).catch(error =>{
        reject(
          logger.error({ methodName: 'updatePlayerLeaderboardPoints', error, resourceType: 'PlayerleaderBoard' })
        )
        });
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `PlayerLeaderboard update took ${Date.now() - startTime} ms`,
      });
      // send response and perform in backgroud for caching
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          playerUuid,
          matchUuid,
          points,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: `${error} is invalid`,
    });
  } catch (error) {
    logger.error(error, { methodName: 'updatePlayerLeaderboardPoints', error, resourceType: 'player' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getPlayerLeaderboardScore
 * Description: Returns the PlayerLeaderboardScore
 * @param {playerUuid, matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid playerUuid, matchUuid
 * -
 */
exports.getPlayerLeaderboardScore = (playerUuid, matchUuid) => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let playerLeaderboardRecord;
    let error = '';
    const [playerId, matchIdDetails] = await Promise.all([
      runSelect('SELECT playerUuid from PlayerDetails WHERE playerUuid=@playerUuid', {
        playerUuid,
      }).catch(error =>{
        reject(
          logger.error({ methodName: 'getPlayerLeaderboardScore', error, resourceType: 'PlayerleaderBoard' })
        )
        }),
      runSelect('SELECT matchUuid from MatchDetails WHERE matchUuid=@matchUuid', {
        matchUuid,
      }).catch(error =>{
        reject(
          logger.error({ methodName: 'getPlayerLeaderboardScore', error, resourceType: 'PlayerleaderBoard' })
        )
        }),
    ]);
    if (!(Array.isArray(playerId) && playerId.length)) {
      error = 'playerUuid ';
    }
    if (!(Array.isArray(matchIdDetails) && matchIdDetails.length)) {
      error += error ? ' && matchUuid' : 'matchUuid';
    }
    if (!error || (Array.isArray(playerLeaderboardRecord) && playerLeaderboardRecord.length)) {
      playerLeaderboardRecord = await runSelect('SELECT playerLeaderboardUuid, playerUuid, matchUuid, points from PlayerLeaderboard WHERE playerUuid =@playerUuid AND matchUuid =@matchUuid', {
        playerUuid,
        matchUuid,
      });
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `PlayerLeaderboard Fetched By Score took ${Date.now() - startTime} ms`,
      });
      // send response and perform in backgroud for caching
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          playerLeaderboard: playerLeaderboardRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: error,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getPlayerLeaderboardScore', error, resourceType: 'PlayerLeaderboard ' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
