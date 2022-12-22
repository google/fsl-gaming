
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
const axios = require('axios').default;
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { mutateInsert, runSelect } = require('../../../FSL-Backend-Common/database/spanner');
const { playerSelection } = require('../../../FSL-Backend-Common/methods/playerSelection');
/* eslint-disable no-multi-assign */
const contestLeaderBoardService = require('../service/ContestLeaderboardService');

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');

// const RedisServer = getFSLResourceManagement();
const { SAVE_SUCCESS, FOUND_SUCCESS, INVALID_FANTASYTEAM_ID } = require('../../../FSL-Backend-Common/config/strings');
const { v4: uuidv4 } = require('uuid');
const { load } = require('yamljs');
const { URLS } = require('../../../FSL-Backend-Common/config/constants');
const { shuffleArray } = require('../../../FSL-Backend-Common/methods/shuffleTeam');

/**
 * Function Name: createFantasyTeamSquadDetailsBulk
 * Description:  Creates the fantasyTeamSquadDetailsBulk api by passing fantasyTeamUuid
 * @param {fantasyTeamUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid fantasyTeamUuid
 * -
 */
exports.createFantasyTeamSquadDetailsBulk = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { fantasyTeamUuid } = params;
    let createdTS;
    let lastUpdatedTS;
    let fantasyTeamSquadUuid;
    let error = '';
    const [fantasyTeamDetails] = await Promise.all([
      runSelect('SELECT team1Uuid,team2Uuid,contestUuid from FantasyTeamDetails WHERE fantasyTeamUuid=@fantasyTeamUuid', {
        fantasyTeamUuid,
      }),
    ]).catch((error) => {
      logger.error({ methodName: 'createFantasyTeamSquadDetailsBulk', error, resourceType: 'FantasySquad' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    if (!(Array.isArray(fantasyTeamDetails) && fantasyTeamDetails.length)) {
      error = 'fantasyTeamUuid ';
    } else {
      const { contestUuid } = fantasyTeamDetails[0];
      const contestDetails = await runSelect('SELECT matchUuid from ContestDetails WHERE contestUuid=@contestUuid', {
        contestUuid,
      }).catch((error) =>{
        logger.error({ methodName: 'createFantasyTeamSquadDetailsBulk', error, resourceType: 'FantasySquad' })
        reject({
          status:INTERNAL_ERROR
        });
      });
      const { matchUuid } = contestDetails[0];
      const { team1Uuid, team2Uuid } = fantasyTeamDetails[0];
      const team1player = await runSelect('SELECT playerUuid,category from PlayerDetails WHERE teamUuid=@team1Uuid', {
        team1Uuid,
      }).catch((error) =>{
        logger.error({ methodName: 'createFantasyTeamSquadDetailsBulk', error, resourceType: 'FantasySquad' })
        reject({
          status:INTERNAL_ERROR
        })
        });
      const team2player = await runSelect('SELECT playerUuid,category from PlayerDetails WHERE teamUuid=@team2Uuid', {
        team2Uuid,
      }).catch((error) =>{
        logger.error({ methodName: 'createFantasyTeamSquadDetailsBulk', error, resourceType: 'FantasySquad' })
        reject({
          status:INTERNAL_ERROR
        })
        });
      const team1players = playerSelection(shuffleArray(team1player));
      const team2players = playerSelection(shuffleArray(team2player));
      const mergedPlayers = team1players.concat(team2players);
      const players = playerSelection(mergedPlayers);
      const promiseFantasyArray = [];
      const promiseCLArray = [];
      const promisePLArray = [];
      for (let i = 0; i < players.length; i += 1) {
        let isCaptain = false;
        let isVCaptain = false;
        fantasyTeamSquadUuid = uuidv4();
        createdTS = new Date();
        lastUpdatedTS = new Date();
        if (i === 2) isCaptain = true;
        else if (i === 4) isVCaptain = true;
        players[i].isCaptain = isCaptain;
        players[i].isVCaptain = isVCaptain;
        const FantasyTeamSquadData = {
          fantasyTeamSquadUuid,
          fantasyTeamUuid,
          playerUuid: players[i].playerUuid,
          isCaptain,
          isVCaptain,
          createdTS,
          lastUpdatedTS,
        };
        promiseFantasyArray.push(mutateInsert('FantasyTeamSquadDetails', FantasyTeamSquadData));
        // await RedisServer.setRedisKey(fantasyTeamSquadUuid, JSON.stringify(FantasyTeamSquadData), REDIS_BUCKET.FANTASY_SQUAD_SERVICE);
        // contestLeaderBoardService.createContestLeaderboard({
        //   playerUuid: players[i].playerUuid, matchUuid, fantasyTeamUuid, contestUuid, isCaptain, isVCaptain,
        // });
        // Redis
        // contestUuid and MatchUuid
        promiseCLArray.push(axios.post(`${URLS[process.env.NODE_ENV]['resource-management']}/contest-leaderboard`, {
          playerUuid: players[i].playerUuid, matchUuid, fantasyTeamUuid, contestUuid, isCaptain, isVCaptain,
        }).catch((error)=>{
          reject({
            status:INTERNAL_ERROR
          })
        }));

        // Redis
        /**
         *  packet = {
          *  data: [{
          *   "bucketName":"",
          *   "score":"",
          *   "value":"",
          *  }]
         *  }
         */
        // }

        const packet2 = {
          data: [{
            bucketName: `${contestUuid}_${fantasyTeamUuid}`,
            score: 0,
            value: `${contestUuid}_${fantasyTeamUuid}_${players[i].playerUuid}`,
          }],
        };

        // let response1 = await axios.post('http://localhost:5009/update-leaderboard/api/updateFLPlayerLeaderBoard', packet)

        promisePLArray.push(axios.post(`${URLS[process.env.NODE_ENV]['update-leaderboard']}/player-leaderBoard`, packet2));

        logger.debug({
          benchMark: false,
          message: 'FantasyTeamSquadDetails Insert Completed',
        });
      }

      await Promise.all(promiseFantasyArray, promiseCLArray, promisePLArray)
        .catch((error)=>{
          logger.error({ methodName: 'createFantasyTeamSquadDetailsBulk', error, resourceType: 'FantasySquad' })
        reject({
          status:INTERNAL_ERROR
        })})

      const packet1 = {
        data: [{
          bucketName: contestUuid,
          score: 0,
          value: fantasyTeamUuid,
        }],
      };
      axios.post(`${URLS[process.env.NODE_ENV]['update-leaderboard']}/contest-leaderboard`, packet1);

      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          fantasyTeamUuid,
          players,
        },
      });
    }

    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `FantasyTeamsSquadDetails Insert took ${Date.now() - startTime} ms`,
    });


    reject({
      status: NOT_FOUND,
      message: `${error} not found`,
    });
  } catch (error) {
    logger.error(error, { methodName: 'createFantasyTeamSquadDetails', error, resourceType: 'FantasyTeamsSquadDetails' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getFantasyTeamsSquadDetailsByFantasyTeamID
 * Description: Returns all the fantasyTeamsSquadDetails
 * @param {fantasyTeamUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid fantasyTeamUuid
 * -
 */
exports.getFantasyTeamsSquadDetailsByFantasyTeamID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let fantasySquadTeamRecord = null;
    // fantasySquadTeamRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.FANTASY_SQUAD_SERVICE);
    // fantasySquadTeamRecord = JSON.parse(fantasySquadTeamRecord);
    // if (!fantasySquadTeamRecord) {
    fantasySquadTeamRecord = await runSelect('SELECT fantasyTeamSquadUuid, fantasyTeamUuid, playerUuid, isCaptain, isVCaptain from FantasyTeamSquadDetails WHERE fantasyTeamUuid=@fantasyTeamUuid', {
      fantasyTeamUuid: params,
    }).catch(error =>{
      logger.error({ methodName: 'getFantasyTeamsSquadDetailsByFantasyTeamID', error, resourceType: 'FantasySquad' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // if (Array.isArray(fantasySquadTeamRecord) && fantasySquadTeamRecord.length) {
    // fantasySquadTeamRecord = fantasySquadTeamRecord[0];
    // await RedisServer.setRedisKey(params, JSON.stringify(fantasySquadTeamRecord), REDIS_BUCKET.FANTASY_SQUAD_SERVICE);
    //   }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `FantasyTeamsSquadDetails By FantasyTeamID Fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(fantasySquadTeamRecord) && fantasySquadTeamRecord.length)) {
      // if ((Array.isArray(fantasySquadTeamRecord) && fantasySquadTeamRecord.length) || (fantasySquadTeamRecord && Object.keys(fantasySquadTeamRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          fantasyTeamPlayerCount: fantasySquadTeamRecord.length,
          fantasyTeamsDetails: fantasySquadTeamRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_FANTASYTEAM_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getFantasyTeamsSquadDetailsByFantasyTeamID', error, resourceType: 'FantasyTeamsSquadDetails' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: createFantasyTeamSquadDetails
 * Description:  Creates the fantasyTeamsSquadDetails
 * @param {fantasyTeamUuid,playerUuid,isCaptain,isVCaptain} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid fantasyTeamUuid and playerUuid
 * -
 */
exports.createFantasyTeamSquadDetails = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const createdTS = new Date();
    const lastUpdatedTS = new Date();
    const fantasyTeamSquadUuid = uuidv4();
    const {
      fantasyTeamUuid, playerUuid, isCaptain, isVCaptain,
    } = params;
    const FantasyTeamSquadData = {
      fantasyTeamSquadUuid,
      fantasyTeamUuid,
      playerUuid,
      isCaptain,
      isVCaptain,
      createdTS,
      lastUpdatedTS,
    };
    // let error = '';
    // const [FantasyTeamRecord, playerRecord] = await Promise.all([
    //   runSelect('SELECT fantasyTeamUuid from FantasyTeamDetails WHERE fantasyTeamUuid=@fantasyTeamUuid', {
    //     fantasyTeamUuid,
    //   }),
    //   runSelect('SELECT playerUuid from PlayerDetails WHERE playerUuid=@playerUuid', {
    //     playerUuid,
    //   }),
    // ]);
    // if (!(Array.isArray(FantasyTeamRecord) && FantasyTeamRecord.length)) {
    //   error = 'fantasyTeamUuid ';
    // }
    // if (!(Array.isArray(playerRecord) && playerRecord.length)) {
    //   error += error ? ' && playerUuid' : 'playerUuid';
    // }
    // if (!error) {
      await mutateInsert('FantasyTeamSquadDetails', FantasyTeamSquadData)
      .catch((error) =>{
        logger.error({ methodName: 'getFantasyTeamsDetailsByContestID', error, resourceType: 'FantasySqaud' })
        reject({
          status:INTERNAL_ERROR
        })
      });
      // await RedisServer.setRedisKey(fantasyTeamSquadUuid, JSON.stringify(FantasyTeamSquadData), REDIS_BUCKET.FANTASY_SQUAD_SERVICE);
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `FantasyTeamSquadDetails Insert took${Date.now() - startTime} ms`,
      });
      // send response and perform in backgroud for caching
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          fantasyTeamSquadUuid,
          fantasyTeamUuid,
          playerUuid,
          isCaptain,
          isVCaptain,
        },
      });
    // }
    reject({
      status: NOT_FOUND,
      message: `${error} not found`,
    });
  } catch (error) {
    logger.error(error, { methodName: 'createFantasyTeamSquadDetails', error, resourceType: 'user' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
