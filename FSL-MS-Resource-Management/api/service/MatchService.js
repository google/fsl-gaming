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

const {
  INTERNAL_ERROR, SUCCESS, NOT_FOUND, BAD_REQUEST,
} = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { mutateInsert, runSelect, mutateUpdate } = require('../../../FSL-Backend-Common/database/spanner');

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');
// const RedisServer = getFSLResourceManagement();

/* eslint-disabmatchStatussle no-multi-assign */

const {
  SAVE_SUCCESS, INVALID_INPUT, FOUND_SUCCESS, INVALID_MATCH_ID, INVALID_TEAM_ID, NO_MATCH_FOUND,
} = require('../../../FSL-Backend-Common/config/strings');
const { v4: uuidv4 } = require('uuid');
const { getAllTeams } = require('./TeamService');
const { matchStatus, URLS } = require('../../../FSL-Backend-Common/config/constants');
// const { cloudJobScheduler } = require('../../../FSL-Backend-Common/utils/cloudScheduler');
const matchSTatus = matchStatus['scheduled'];

/**
 * Function Name: createMatchAuto
 * Description:  Creates the Match by Randomly picking the created Team
 * @param {*} params
 * @returns
 *
 * Exceptions: None
 * -
 */
exports.createMatchAuto = () => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let teamDetails = [];
    // const teamRecord = await RedisServer.getAllKeyValues(REDIS_BUCKET.TEAM_DETAILS);
    // Object.values(teamRecord).forEach((item) => {
    //   teamDetails.push(JSON.parse(item));
    // });
    const matchUuid = uuidv4();
    if (!(Array.isArray(teamDetails) && teamDetails.length)) {
      const allTeams = await getAllTeams();
      teamDetails = allTeams.data.teamList;
    }
    const teams = [];
    do {
      const selectedTeam = teamDetails[Math.floor(Math.random() * teamDetails.length)];
      const obj = teams.find(team => team.teamUuid === selectedTeam.teamUuid);
      if (!obj) teams.push(selectedTeam);
    } while (teams.length < 2);
    const matchTime = new Date();
    matchTime.setHours(matchTime.getHours() + 2);
    // send response and perform in backgroud for cachin
    if (teamDetails && Array.isArray(teamDetails) && teams.length === 2) {
      const [team1, team2] = teams;
      const team1Uuid = team1.teamUuid;
      const team2Uuid = team2.teamUuid;
      const matchData = {
        matchUuid,
        team1Uuid,
        team2Uuid,
        matchTime,
        matchSTatus,
      };
      // responsefromscheduler = await cloudJobScheduler({
      //   url: `${URLS[process.env.NODE_ENV]['simulator']}/simulateMatch`,
      //   method: 'POST',
      //   body:
      //   {
      //     "match_id": matchUuid
      //   }
      // })

      await mutateInsert('MatchDetails', matchData)
      .catch((error) =>{
        logger.error({ methodName: 'createMatchAuto', error, resourceType: 'Match' })
        reject({
          status:INTERNAL_ERROR
        })
        });
      // await RedisServer.setRedisKey(matchUuid, JSON.stringify(matchData), REDIS_BUCKET.MATCH_DETAILS);
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: matchData,
      });
      const matchTime1 = new Date();
      matchTime1.setMinutes(matchTime.getMinutes() + 1);
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `Match Details Insert took ${Date.now() - startTime} ms`,
      });
    }
    //  else {
    //   reject({
    //     status: NOT_FOUND,
    //     message: NOT_FOUND,
    //   });
    // }
  } catch (error) {
    logger.error(error, { methodName: 'createMatchAuto', error, resourceType: 'match' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: createMatch
 * Description: Creates the Match by passing team1Uuid and team2Uuid
 * @param {*} params
 * @returns
 *
 * Exceptions: None
 * -
 */
exports.createMatch = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const matchUuid = uuidv4();
    const { team1Uuid, team2Uuid } = params;
    const matchTime = new Date();
    matchTime.setHours(matchTime.getHours() + 2);

    // let error = '';
    // const [team1Record, team2Record] = await Promise.all([
    //   runSelect('SELECT teamUuid from TeamDetails WHERE teamUuid=@team1Uuid', {
    //     team1Uuid,
    //   }),
    //   runSelect('SELECT teamUuid from TeamDetails WHERE teamUuid=@team2Uuid', {
    //     team2Uuid,
    //   }),
    // ]);
    // if (!((team1Record) || (team2Record))) {
    //   error = ' Invalid Entry';
    // }
    // if (!error) {
    const matchData = {
      matchUuid,
      team1Uuid,
      team2Uuid,
      matchTime,
      matchSTatus,
      createdTS: new Date(),
      lastUpdatedTS: new Date(),
    };
      // if (!(Array.isArray(team2Record) && team2Record.length) && !(Array.isArray(team1Record) && team1Record.length)) {
      //   reject({
      //     status: NOT_FOUND,
      //     message: ' Invalid team1uuid and team2Uuid ',
      //   });
      // }
      // if (team1Uuid === team2Uuid) {
      //   reject({
      //     status: BAD_REQUEST,
      //     message: 'team1Uuid and team2Uuid should not same',
      //   });
      // } else if (!(Array.isArray(team1Record) && team1Record.length)) {
      //   reject({
      //     status: NOT_FOUND,
      //     message: ' Invalid team1Uuid ',
      //   });
      // } else if (!(Array.isArray(team2Record) && team2Record.length)) {
      //   reject({
      //     status: NOT_FOUND,
      //     message: ' Invalid team2Uuid ',
      //   });
      // }
      // responsefromscheduler = await cloudJobScheduler({
      //   url: `${URLS[process.env.NODE_ENV]['simulator']}/simulateMatch`,
      //   method: 'POST',
      //   body:
      //   {
      //     "match_id": matchUuid
      //   }
      // })
  
      await mutateInsert('MatchDetails', matchData)
      .catch((error) =>{
        logger.error({ methodName: 'createMatch', error, resourceType: 'Match' })
        reject({
          status:INTERNAL_ERROR
        })
        });
      // await RedisServer.setRedisKey(matchUuid, JSON.stringify(matchData), REDIS_BUCKET.MATCH_DETAILS);
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: matchData,
      })
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `Match Details Insert took ${Date.now() - startTime} ms`,
      });
    
    // reject({
    //   status: BAD_REQUEST,
    //   message: "match inprogress",
    // });
  } catch (error) {
    logger.error(error, { methodName: 'createMatch', error, resourceType: 'match' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getMatchByID
 * Description: Returns Match by MatchID
 * @param {matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid MatchID
 * -
 */
exports.getMatchByID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let matchRecord = [];
    // matchRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.MATCH_DETAILS);
    // matchRecord = JSON.parse(matchRecord);
    // if (!matchRecord) {
    matchRecord = await runSelect('SELECT matchUuid, team1Uuid, team2Uuid, matchTime, matchStatus from MatchDetails WHERE matchuuid=@matchuuid', {
      matchuuid: params,
    }).catch((error) =>{
      logger.error({ methodName: 'getMatchByID', error, resourceType: 'Match' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // if (Array.isArray(matchRecord) && matchRecord.length) {
    // matchRecord = matchRecord[0];
    // await RedisServer.setRedisKey(params, JSON.stringify(matchRecord), REDIS_BUCKET.MATCH_DETAILS);
    // }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Match Details Fethched BY ID ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(matchRecord) && matchRecord.length)) {
      // if ((Array.isArray(matchRecord) && matchRecord.length) || (matchRecord && Object.keys(matchRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          match: matchRecord,
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
 * Function Name: getAllMatch
 * Description: Returns all the Match
 * @param {*} params
 * @returns
 *
 * Exceptions: Throws Exception on No Matches Found
 * -
 */
exports.getAllMatch = () => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let matchList = [];
    // const matchData = await RedisServer.getAllKeyValues(REDIS_BUCKET.MATCH_DETAILS);
    // Object.values(matchData).forEach((item) => {
    //   matchList.push(JSON.parse(item));
    // });
    // if (!(Array.isArray(matchList) && matchList.length)) {
    matchList = await runSelect('SELECT matchUuid, team1Uuid, team2Uuid, matchTime, matchStatus from MatchDetails')
    .catch((error) =>{
      logger.error({ methodName: 'getAllMatch', error, resourceType: 'Match' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `All Match Details Fethched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (matchList && matchList.length > 0) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          matchCount: matchList.length,
          matchList,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_MATCH_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getAllMatch', error, resourceType: 'match' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getMatchesByTeamID
 * Description: Returns the Match By Team ID
 * @param {teamUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid teamUuid
 * -
 */
exports.getMatchesByTeamID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let matchRecord = [];
    // matchRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.MATCH_DETAILS);
    // matchRecord = JSON.parse(matchRecord);
    // if (!matchRecord) {
    matchRecord = await runSelect('SELECT matchUuid, team1Uuid, team2Uuid, matchTime, matchStatus from MatchDetails WHERE team1Uuid=@teamUuid OR team2Uuid=@teamUuid', {
      teamUuid: params,
    }).catch((error) =>{
      logger.error({ methodName: 'getMatchesByTeamID', error, resourceType: 'Match' })
      reject({
        status: INTERNAL_ERROR
      })
      });
    // if (Array.isArray(matchRecord) && matchRecord.length) {
    //   // matchRecord = matchRecord[0];
    //   // await RedisServer.setRedisKey(params, JSON.stringify(matchRecord), REDIS_BUCKET.MATCH_DETAILS);
    // }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Match Details Fethched By Team ID ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(matchRecord) && matchRecord.length)) {
      // if ((Array.isArray(matchRecord) && matchRecord.length) || (matchRecord && Object.keys(matchRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          matchCount: matchRecord.length,
          match: matchRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_TEAM_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getMatchesByTeamID', error, resourceType: 'match' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: updateMatch
 * Description: Returns updated matchTime and matchSTatus for the Match
 * @param {teamUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchUuid
 * -
 */
exports.updateMatch = (id, params) => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { matchTime, matchStatus } = params;
    // let matchDetails = await RedisServer.getRedisKey(id, REDIS_BUCKET.MATCH_DETAILS);
    // matchDetails = JSON.parse(matchDetails);
    // matchDetails.matchTime = matchTime;
    // matchDetails.matchStatus = matchStatus;
    // matchDetails.lastUpdatedTS = new Date();
    const matchRecord = await runSelect('SELECT matchUuid from MatchDetails WHERE matchUuid=@matchUuid', {
      matchUuid: id,
    }).catch((error) =>{
      logger.error({ methodName: 'updateMatch', error, resourceType: 'Match' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // if (Array.isArray(matchRecord) && matchRecord.length) {
    await mutateUpdate('MatchDetails', {
      matchUuid: id,
      matchTime,
      matchStatus,
    }).catch((error) =>{
      logger.error({ methodName: 'updateMatch', error, resourceType: 'Match' })
      reject({
        status:INTERNAL_ERROR
      })
      });
    // await RedisServer.setRedisKey(id, JSON.stringify(matchDetails), REDIS_BUCKET.MATCH_DETAILS);
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Update Match Update took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    resolve({
      status: SUCCESS,
      message: SAVE_SUCCESS,
      data: {
        matchTime,
        matchSTatus,
      },
    });
    // }
    reject({
      status: NOT_FOUND,
      message: INVALID_MATCH_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'updateMatch', error, resourceType: 'match' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
