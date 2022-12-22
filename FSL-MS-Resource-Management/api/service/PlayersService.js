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
/* eslint prefer-destructuring: ["off", {AssignmentExpression: {array: true}}] */
/* eslint no-shadow: "off" */
/* eslint-disable no-await-in-loop */

const { INTERNAL_ERROR, SUCCESS, NOT_FOUND } = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { mutateInsert, runSelect, mutateUpdate } = require('../../../FSL-Backend-Common/database/spanner');
/* eslint-disable no-multi-assign */

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');
// const RedisServer = getFSLResourceManagement();

const {
  SAVE_SUCCESS, FOUND_SUCCESS, INVALID_TEAM_ID, INVALID_PLAYER_ID, NO_PLAYER_FOUND,
} = require('../../../FSL-Backend-Common/config/strings');
const { v4: uuidv4 } = require('uuid');
const { fetchPlayerCount } = require('../../../FSL-Backend-Common/methods/playerSelection');
const { generateName } = require('../../../FSL-Backend-Common/methods/generateName');
const { playersCount } = require('../../../FSL-Backend-Common/config/constants');

/**
 * Function Name: createPlayersBulk
 * Description:  Creates the Player by passing teamUuid
 * @param {matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid teamUuid
 * -
 */
exports.createPlayersBulk = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { teamUuid } = params;
    const teamRecord = await runSelect('SELECT teamUuid, availablePlayers from TeamDetails WHERE teamUuid=@teamUuid', {
      teamUuid,
    }).catch(error =>{
      reject(
        logger.error({ methodName: 'createPlayersBulk', error, resourceType: 'Player' })
      )
      });
    if (!(Array.isArray(teamRecord) && teamRecord.length)) {
      resolve({
        status: NOT_FOUND,
        message: INVALID_TEAM_ID,
      });
    }
    const { availablePlayers } = teamRecord[0];
    const players = await runSelect('SELECT playerUuid,category from PlayerDetails WHERE teamUuid=@teamUuid', {
      teamUuid,
    }).catch(error =>{
      reject(
        logger.error({ methodName: 'createPlayersBulk', error, resourceType: 'Player' })
      )
      });
    const playerCount = fetchPlayerCount(players);
    let playerUuid;
    let playerName;
    const categoryVal = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];
    let category;
    let count =0;
    if (players && players.length < availablePlayers) {
      for (let i = players.length; i < availablePlayers; i += 1) {
        playerUuid = uuidv4();

        if (playerCount[categoryVal[0]] < 5) {
          playerCount[categoryVal[0]] += 1;
          category = categoryVal[0];
        } else if (playerCount[categoryVal[1]] < 5) {
          playerCount[categoryVal[1]] += 1;
          category = categoryVal[1];
        } else if (playerCount[categoryVal[2]] < 3) {
          playerCount[categoryVal[2]] += 1;
          category = categoryVal[2];
        } else {
          playerCount[categoryVal[3]] += 1;
          [, , , category] = categoryVal;
        }
        playerName = `player-${generateName()}`;
        const playerData = {
          playerUuid,
          teamUuid,
          playerName,
          category,
          createdTS: new Date(),
          lastUpdatedTS: new Date(),
        };
        await mutateInsert('PlayerDetails', playerData).catch(error =>{
          reject(
            logger.error({ methodName: 'createPlayersBulk', error, resourceType: 'Player' })
          )
          });
        // await RedisServer.setRedisKey(playerUuid, JSON.stringify(playerData), REDIS_BUCKET.PLAYER_DETAILS);
        logger.debug({
          benchMark: false,
          responseTime: `${Date.now() - startTime}`,
          message: `PlayerDetails Insert took ${Date.now() - startTime} ms`,
        });
        count=count+1
        // send response and perform in backgroud for caching
      }
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          totalPlayersCreated: count
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: `already ${availablePlayers} players exist in the team`,
    });
  } catch (error) {
    logger.error(error, { methodName: 'createPlayersBulk', error, resourceType: 'player' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: createPlayers
 * Description:  Creates the Player by passing teamUuid and category
 * @param {teamUuid and category} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid teamUuid
 * -
 */
exports.createPlayers = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const playerUuid = uuidv4();
    const { teamUuid, category } = params;
    let error = INVALID_TEAM_ID;
    const playerName = `player-${generateName()}`;
    const teamRecord = await runSelect('SELECT teamUuid,availablePlayers from TeamDetails WHERE teamUuid=@teamUuid', {
      teamUuid,
    }).catch(error =>{
      reject(
        logger.error({ methodName: 'createPlayers', error, resourceType: 'Player' })
      )
      });
    if (teamRecord && teamRecord.length) {
      const playerRecord = await runSelect('SELECT playerUuid,category from PlayerDetails WHERE teamUuid=@teamUuid', {
        teamUuid,
      }).catch(error =>{
        reject(
          logger.error({ methodName: 'createPlayers', error, resourceType: 'Player' })
        )
        });
      if (teamRecord[0].availablePlayers > playerRecord.length) {
        let categoryPlayerCount = 0;
        const playerCount = fetchPlayerCount(playerRecord);
        if (category === 'Wicket-Keeper') {
          const remainingWicketKeeper = teamRecord[0].availablePlayers - (playersCount.Batsman + playersCount.Bowler + playersCount['All-Rounder']);
          categoryPlayerCount = remainingWicketKeeper - playerCount['Wicket-Keeper'];
        } else {
          categoryPlayerCount = playersCount[category] - playerCount[category];
        }
        const playerData = {
          playerUuid,
          teamUuid,
          playerName,
          category,
          createdTS: new Date(),
          lastUpdatedTS: new Date(),
        };
        if (categoryPlayerCount > 0) {
          await mutateInsert('PlayerDetails', playerData)
          .catch(error =>{
            reject(
              logger.error({ methodName: 'createPlayers', error, resourceType: 'Player' })
            )
            });
          // await RedisServer.setRedisKey(playerUuid, JSON.stringify(playerData), REDIS_BUCKET.PLAYER_DETAILS);
          logger.debug({
            benchMark: false,
            responseTime: `${Date.now() - startTime}`,
            message: `PlayerDetails Insert took ${Date.now() - startTime} ms`,
          });
          // send response and perform in backgroud for caching
          resolve({
            status: SUCCESS,
            message: SAVE_SUCCESS,
            data: {
              playerUuid,
              playerName,
              teamUuid,
              category,
            },
          });
        }
        error = `Max ${category} count reached`;
      } else {
        error = 'Max team player count reached';
      }
    }
    reject({
      status: NOT_FOUND,
      message: error,
    });
  } catch (error) {
    logger.error(error, { methodName: 'createPlayers', error, resourceType: 'players' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getPlayerbyID
 * Description: Returns the Players by passing PlayerID
 * @param {playerUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid playerUuid
 * -
 */
exports.getPlayerbyID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let playerRecord = [];
    // playerRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.PLAYER_DETAILS);
    // playerRecord = JSON.parse(playerRecord);
    // if (!playerRecord) {
    playerRecord = await runSelect('SELECT playerUuid, teamUuid, playerName, category from PlayerDetails WHERE playerUuid=@playerUuid', {
      playerUuid: params,
    }).catch(error =>{
      reject(
        logger.error({ methodName: 'getPlayerbyID', error, resourceType: 'Player' })
      )
      });
    // if (Array.isArray(playerRecord) && playerRecord.length) {
    //   playerRecord = playerRecord[0];
    //   await RedisServer.setRedisKey(params, JSON.stringify(playerRecord), REDIS_BUCKET.PLAYER_DETAILS);
    // }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Players Details Fetched By PlayerID took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(playerRecord) && playerRecord.length)) {
      // if ((Array.isArray(playerRecord) && playerRecord.length) || (playerRecord && Object.keys(playerRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          player: playerRecord[0],
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_PLAYER_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'playerUuid', error, resourceType: 'player' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getPlayersbyTeamID
 * Description: Returns the Players by passing TeamID
 * @param {teamUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid teamUuid
 * -
 */
exports.getPlayersbyTeamID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let playerRecord = [];
    // playerRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.PLAYER_DETAILS);
    // playerRecord = JSON.parse(playerRecord);
    // if (!playerRecord) {
    playerRecord = await runSelect('SELECT playerUuid, teamUuid, playerName, category from PlayerDetails WHERE teamUuid=@teamUuid', {
      teamUuid: params,
    }).catch(error =>{
      reject(
        logger.error({ methodName: 'getPlayersbyTeamID', error, resourceType: 'Player' })
      )
      });
    // if (Array.isArray(playerRecord) && playerRecord.length) {
    //   await RedisServer.setRedisKey(params, JSON.stringify(playerRecord), REDIS_BUCKET.PLAYER_DETAILS);
    // }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Players Details Fetched By Team ID took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(playerRecord) && playerRecord.length)) {
      // if ((Array.isArray(playerRecord) && playerRecord.length) || (playerRecord && Object.keys(playerRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          playersCount: playerRecord.length,
          players: playerRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_TEAM_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'teamUuid', error, resourceType: 'player' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getAllPlayers
 * Description: Returns the All Players
 * @param {*} params
 * @returns
 *
 * Exceptions: Throws Exception on No Players Found
 * -
 */
exports.getAllPlayers = () => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let playerList = [];
    // const playerRecord = await RedisServer.getAllKeyValues(REDIS_BUCKET.PLAYER_DETAILS);
    // Object.values(playerRecord).forEach((item) => {
    //   playerList.push(JSON.parse(item));
    // });
    // if (!(Array.isArray(playerList) && playerList.length)) {
    playerList = await runSelect('SELECT playerUuid, teamUuid, playerName, category from PlayerDetails')
    .catch(error =>{
      reject(
        logger.error({ methodName: 'getAllPlayers', error, resourceType: 'Player' })
      )
      });
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `All Player Details fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (playerList && playerList.length > 0) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          playerCount: playerList.length,
          playerList,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_PLAYER_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getAllPlayers', error, resourceType: 'player' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: updatePlayer
 * Description: Returns updated playerName and category for the Player
 * @param {playerName,category} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid playerUuid
 * -
 */
exports.updatePlayer = (id, params) => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { playerName, category } = params;
    // let playerDetails = await RedisServer.getRedisKey(id, REDIS_BUCKET.PLAYER_DETAILS);
    // playerDetails = JSON.parse(playerDetails);
    // playerDetails.playerName = playerName;
    // playerDetails.category = category;
    const playerRecord = await runSelect('SELECT playerUuid from PlayerDetails WHERE playerUuid=@playerUuid', {
      playerUuid: id,
    }).catch(error =>{
      reject(
        logger.error({ methodName: 'updatePlayer', error, resourceType: 'Player' })
      )
      });
    // if (Array.isArray(playerRecord) && playerRecord.length) {
    await mutateUpdate('PlayerDetails', {
      playerUuid: id,
      playerName,
      category,
      lastUpdatedTS: new Date(),
    }).catch(error =>{
      reject(
        logger.error({ methodName: 'updatePlayer', error, resourceType: 'Player' })
      )
      });
    // await RedisServer.setRedisKey(id, JSON.stringify(playerDetails), REDIS_BUCKET.PLAYER_DETAILS);
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Player update took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    resolve({
      status: SUCCESS,
      message: SAVE_SUCCESS,
      data: {
        playerName,
        category,
      },
    });
    // }
    reject({
      status: NOT_FOUND,
      message: INVALID_PLAYER_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'updatePlayer', error, resourceType: 'player' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
