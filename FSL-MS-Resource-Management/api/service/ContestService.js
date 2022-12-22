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
const { v4: uuidv4 } = require('uuid');
const {
  INTERNAL_ERROR, SUCCESS, NOT_FOUND, BAD_REQUEST,
} = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { mutateInsert, runSelect, mutateUpdate } = require('../../../FSL-Backend-Common/database/spanner');

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');

// const RedisServer = getFSLResourceManagement();

/* eslint-disable no-multi-assign */

const {
  SAVE_SUCCESS, FOUND_SUCCESS, INVALID_CREDENTIALS, INVALID_MATCH_ID, INVALID_CONTEST_ID, NO_CONTEST_FOUND, NO_IN_PROGRESS_CONTEST_FOUND, NO_COMPLETED_CONTEST_FOUND, NO_SCHEDULED_CONTEST_FOUND,
} = require('../../../FSL-Backend-Common/config/strings');
const { slotSize, contestStatus } = require('../../../FSL-Backend-Common/config/constants');
const { playerSelection } = require('../../../FSL-Backend-Common/methods/playerSelection');

/**
 * Function Name: createContest
 * Description: Creates the Contest by passing matchUuid
 * @param {matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchUuid
 * -
 */
exports.createContest = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const contestUuid = uuidv4();
    const { matchUuid } = params;
    const slot = Math.floor(Math.random() * (slotSize.max - slotSize.min + 1)) + slotSize.min;
    const status = contestStatus['scheduled'];
    const createdTS = new Date();
    const lastUpdatedTS = new Date();
    const matchRecord = await runSelect('SELECT matchUuid,team1Uuid,team2Uuid from MatchDetails WHERE matchUuid=@matchUuid', {
      matchUuid,
    })
    .catch(error =>{
      logger.error({ methodName: 'createContest', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    const { team1Uuid, team2Uuid } = matchRecord[0];
    const contestData = {
      contestUuid,
      matchUuid,
      team1Uuid,
      team2Uuid,
      slot,
      results: null,
      contestStatus: status,
      createdTS,
      lastUpdatedTS,
    };
    if (matchRecord && matchRecord.length) {
      await mutateInsert('ContestDetails', contestData)
      .catch(error =>{
        logger.error({ methodName: 'createContest', error, resourceType: 'Contest' })
        reject({
          status:INTERNAL_ERROR
        } )
      });
      // await RedisServer.setRedisKey(contestUuid, JSON.stringify(contestData), REDIS_BUCKET.CONTEST_DETAILS);
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `ContestDetails Insert took ${Date.now() - startTime} ms`,
      });
      // send response and perform in backgroud for caching
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          contestUuid,
          matchUuid,
          team1Uuid,
          team2Uuid,
          slot,
          contestStatus: status,
        },
      });
    } reject({
      status: NOT_FOUND,
      message: INVALID_MATCH_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'createContest', error, resourceType: 'Contest' });
    reject({
      status: BAD_REQUEST,
      message: INVALID_CREDENTIALS,
    });
  }
});

exports.createPlaying11 = params => new Promise(async (resolve, reject) => {
  try {
    const { matchUuid } = params;
    const matchDetails = await runSelect('SELECT team1Uuid,team2Uuid from MatchDetails WHERE matchUuid=@matchUuid', {
      matchUuid,
    }).catch((error) =>{
      logger.error({ methodName: 'createContest', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
     
    });
    if (matchDetails) {
      const { team1Uuid, team2Uuid } = matchDetails[0];
      const team1player = await runSelect('SELECT playerUuid,category from PlayerDetails WHERE teamUuid=@team1Uuid', {
        team1Uuid,
      }).catch((error) =>{
        logger.error({ methodName: 'createContest', error, resourceType: 'Contest' })
        reject({
          status:INTERNAL_ERROR
        })
        
      });
      const team2player = await runSelect('SELECT playerUuid,category from PlayerDetails WHERE teamUuid=@team2Uuid', {
        team2Uuid,
      }).catch((error) =>{
        logger.error({ methodName: 'createContest', error, resourceType: 'Contest' })
        reject({
          status:INTERNAL_ERROR
        })
      });
      const team1players = await playerSelection(team1player);
      const team2players = await playerSelection(team2player);
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        teams: [team1Uuid, team2Uuid],
        data: {
          team1: team1players,
          team2: team2players,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_MATCH_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'createContest', error, resourceType: 'Contest' });
    reject({
      status: BAD_REQUEST,
      message: INVALID_CREDENTIALS,
    });
  }
});

/**
 * Function Name: getAllContests
 * Description: Returns all the Contests
 * @param {*} params
 * @returns
 *
 * Exceptions: Throws Exception on No Contests Found
 * -
 */
exports.getAllContests = () => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let contestsList = [];
    // const contestRecord = await RedisServer.getAllKeyValues(REDIS_BUCKET.CONTEST_DETAILS);
    // Object.values(contestRecord).forEach((item) => {
    //   contestsList.push(JSON.parse(item));
    // });
    // if (!(Array.isArray(contestsList) && contestsList.length)) {
    contestsList = await runSelect('SELECT contestUuid,matchUuid,team1Uuid,team2Uuid,slot,results,winnerTeamUuid,contestStatus from ContestDetails')
    .catch(error =>{
      reject(
        logger.error({ methodName: 'getAllContests', error, resourceType: 'Contest' })
      )
    });
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `All Contest Fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (contestsList) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          contestCount: contestsList.length,
          contestsList,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_CONTEST_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getAllContests', error, resourceType: 'Contest' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getContestbyID
 * Description: Returns Contest by Contest ID
 * @param {contestUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid contestUuid
 * -
 */
exports.getContestbyID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let contestRecord = null;
    // contestRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.CONTEST_DETAILS);
    // contestRecord = JSON.parse(contestRecord);
    // if (!contestRecord) {
    contestRecord = await runSelect('SELECT contestUuid,matchUuid,team1Uuid,team2Uuid,slot,results,winnerTeamUuid,contestStatus from ContestDetails WHERE contestUuid=@contestUuid', {
      contestUuid: params,
    }).catch((error) =>{
      logger.error({ methodName: 'getContestbyID', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    // if (Array.isArray(contestRecord) && contestRecord.length) {
    //   contestRecord = contestRecord[0];
    //   await RedisServer.setRedisKey(params, JSON.stringify(contestRecord), REDIS_BUCKET.CONTEST_DETAILS);
    //   }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `ContestDetails Insert took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(contestRecord) && contestRecord.length)) {
      // if ((Array.isArray(contestRecord) && contestRecord.length) || (contestRecord && Object.keys(contestRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          Contests: contestRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_CONTEST_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'contestUuid', error, resourceType: 'Contest' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

exports.updateWinnersList = params =>
  new Promise(async (resolve, reject) => {
    try {
      const startTime = Date.now();
      const contestDetails = await runSelect(
        'SELECT contestUuid FROM ContestDetails WHERE contestUuid=@contestUuid',
        {
          contestUuid: params.contestId,
        },
      ).catch((error) =>{
        logger.error({ methodName: 'updateWinnersList', error, resourceType: 'Contest' })
        reject({
          status:INTERNAL_ERROR
        })
      });
      if (!contestDetails.length) {
        reject({
          status: BAD_REQUEST,
          message: INVALID_CONTEST_ID,
        })
      }
      const winnerList = params.results;
      const contestData = {
        contestUuid: params.contestId,
        contestStatus: contestStatus['completed'],
        winnerTeamUuid: winnerList[0].value,
        results: { winnerList },
        lastUpdatedTS: new Date(),
      }
      const isUpdated = await mutateUpdate('ContestDetails', contestData)
      .catch((error) =>{
        logger.error({ methodName: 'updateWinnersList', error, resourceType: 'Contest' })
        reject(
          {
            status:INTERNAL_ERROR,
          }
        )
      });
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `ContestDetails WinnerList Upadted took at ${Date.now() - startTime} ms`,
      });
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
      });
    
  } catch (error) {
    logger.error(error, {
      methodName: 'updateWinnerList',
      error,
      resourceType: 'ContestLeaderboard',
    });
    reject({
      status: INTERNAL_ERROR,
      error,
    });
  }
});

/**
 * Function Name: getContestsByMatchID
 * Description: Returns Contest by Match ID
 * @param {matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchUuid
 * -
 */
exports.getContestsByMatchID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let contestRecord = null;
    // contestRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.CONTEST_DETAILS);
    // contestRecord = JSON.parse(contestRecord);
    // if (!contestRecord) {
    contestRecord = await runSelect('SELECT contestUuid,matchUuid,team1Uuid,team2Uuid,slot,results,winnerTeamUuid,contestStatus  from ContestDetails WHERE matchUuid=@matchUuid', {
      matchUuid: params,
    }).catch((error) =>{
      logger.error({ methodName: 'getContestsByMatchID', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    // if (Array.isArray(contestRecord) && contestRecord.length) {
    //   contestRecord = contestRecord[0];
    //   await RedisServer.setRedisKey(params, JSON.stringify(contestRecord), REDIS_BUCKET.CONTEST_DETAILS);
    //   }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `ContestDetails Fetched By Match ID took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(contestRecord) && contestRecord.length)) {
      // if ((Array.isArray(contestRecord) && contestRecord.length) || (contestRecord && Object.keys(contestRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          contestCount: contestRecord.length,
          contests: contestRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_MATCH_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'contestUuid', error, resourceType: 'Contest' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getContestsByActiveStatus
 * Description: Returns Contest by Active Status
 * @param {*} params
 * @returns
 *
 * Exceptions: Throws Exception on No Active Status Found
 * -
 */
exports.getContestsByActiveStatus = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const contestRecord = await runSelect('SELECT contestUuid,matchUuid,team1Uuid,team2Uuid,slot,results,winnerTeamUuid,contestStatus from ContestDetails WHERE contestStatus=\'IN-PROGRESS\'')
    .catch((error) =>{
      logger.error({ methodName: 'getContestsByActiveStatus', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      });
    });
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `ContestDetails Fetched By Match ID took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (contestRecord && contestRecord.length) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          contestCount: contestRecord.length,
          contests: contestRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_IN_PROGRESS_CONTEST_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getContestsByActiveStatus', error, resourceType: 'contest' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getContestsByScheduledStatus
 * Description: Returns Contest by Scheduled Status
 * @param {*} params
 * @returns
 *
 * Exceptions: Throws Exception on No Scheduled Status Found
 * -
 */
exports.getContestsByScheduledStatus = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const contestRecord = await runSelect('SELECT contestUuid,matchUuid,team1Uuid,team2Uuid,slot,results,winnerTeamUuid,contestStatus from ContestDetails WHERE contestStatus=\'SCHEDULED\'')
    .catch((error) =>{
      logger.error({ methodName: 'getContestsByScheduledStatus', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `ContestDetails Fetched By Match ID took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (contestRecord && contestRecord.length) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          contestCount: contestRecord.length,
          contests: contestRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_SCHEDULED_CONTEST_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getContestsByScheduledStatus', error, resourceType: 'contest' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getContestsByCompletedStatus
 * Description: Returns Contest by Completed Status
 * @param {*} params
 * @returns
 *
 * Exceptions: Throws Exception on No Completed Status Found
 * -
 */
exports.getContestsByCompletedStatus = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const contestRecord = await runSelect('SELECT contestUuid,matchUuid,team1Uuid,team2Uuid,slot,results,winnerTeamUuid,contestStatus from ContestDetails WHERE contestStatus=\'COMPLETED\'')
    .catch((error) =>{
      logger.error({ methodName: 'getContestsByCompletedStatus', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `ContestDetails Fetched By COMPLETED Status took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (contestRecord && contestRecord.length) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          contestCount: contestRecord.length,
          contests: contestRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_COMPLETED_CONTEST_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getContestsByCompletedStatus', error, resourceType: 'contest' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: updateContest
 * Description: Returns updated slot and contestStatus for the Contest
 * @param {contestStatus} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid contestUuid
 * -
 */
exports.updateContest = (id, params) => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { slot, contestStatus } = params;
    let contestRecord = [];
    // let contestDetails = await RedisServer.getRedisKey(id, REDIS_BUCKET.CONTEST_DETAILS);
    // contestDetails = JSON.parse(contestDetails);
    // contestDetails.slot = slot;
    // contestDetails.contestStatus = contestStatus;
    // contestDetails.lastUpdatedTS = new Date();
    contestRecord = await runSelect('SELECT contestUuid from ContestDetails WHERE contestUuid=@contestUuid', {
      contestUuid: id,
    }).catch((error) =>{
      logger.error({ methodName: 'updateContest', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    // if (Array.isArray(contestRecord) && contestRecord.length) {
    await mutateUpdate('ContestDetails', {
      contestUuid: id,
      slot,
      contestStatus,
      lastUpdatedTS: new Date(),
    }).catch((error) =>{
      logger.error({ methodName: 'updateContest', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    // await RedisServer.setRedisKey(id, JSON.stringify(contestDetails), REDIS_BUCKET.CONTEST_DETAILS);
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `updateContest update took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    resolve({
      status: SUCCESS,
      message: SAVE_SUCCESS,
      data: {
        slot,
        contestStatus,
      },

    });
    // }
    reject({
      status: NOT_FOUND,
      message: INVALID_CONTEST_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'updateContest', error, resourceType: 'Contest' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

exports.getContestResultbyID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const contestRecord = await runSelect('SELECT contestUuid,results,winnerTeamUuid,contestStatus from ContestDetails WHERE contestUuid=@contestUuid', {
      contestUuid: params,
    }).catch((error)=>{
      logger.error({ methodName: 'getContestResultbyID', error, resourceType: 'Contest' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `ContestDetailupdateWinnersLists Insert took ${Date.now() - startTime} ms`,
    });

    // send response and perform in backgroud for caching
    if ((Array.isArray(contestRecord) && contestRecord.length && contestRecord[0].contestStatus === 'COMPLETED')) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          Contests: contestRecord,
        },
      });
    } else if (!(Array.isArray(contestRecord) && contestRecord.length)) {
      reject({
        status: NOT_FOUND,
        message: INVALID_CONTEST_ID,
      });
    } else if (contestRecord[0].contestStatus !== 'COMPLETED') {
      reject({
        status: NOT_FOUND,
        message: 'match not completed',
      });
    }
  } catch (error) {
    logger.error(error, { methodName: 'getContestResultbyID', error, resourceType: 'Contest' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
