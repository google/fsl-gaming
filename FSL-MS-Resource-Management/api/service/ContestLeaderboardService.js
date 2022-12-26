// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// TODO: High-level file comment.

/* eslint-disable no-multi-assign */
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
const {
  INTERNAL_ERROR,
  SUCCESS,
  NOT_FOUND,
} = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');

// const RedisServer = getFSLResourceManagement();

const {
  points,
  contestStatus,
} = require('../../../FSL-Backend-Common/config/constants');

const {
  mutateInsert,
  runSelect,
  mutateUpdate,
  Spanner,
} = require('../../../FSL-Backend-Common/database/spanner');
const {
  SAVE_SUCCESS,
  INVALID_INPUT,
  FOUND_SUCCESS,
  INVALID_CONTEST_LEADERBOARD_ID,
  INVALID_CONTEST_ID,
  NO_CONTEST_LEADERBOARD_FOUND,
} = require('../../../FSL-Backend-Common/config/strings');

/**
 * Function Name: createContestLeaderboard
 * Description: Creates the Contest Leaderboard by passing playerUuid, matchUuid, contestUuid, fantasyTeamUuid
 * @param {playerUuid, matchUuid, contestUuid, fantasyTeamUuid, isCaptain, isVCaptain} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid playerUuid, matchUuid, contestUuid, fantasyTeamUuid
 * -
 */
exports.createContestLeaderboard = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const contestLeaderUuid = uuidv4();
    const {
      playerUuid, matchUuid, contestUuid, fantasyTeamUuid, isCaptain, isVCaptain,
    } = params;
    // let error = '';
    // const [playerId, matchId, contestId, fantasyTeamId] = await Promise.all([
    //   runSelect('SELECT playerUuid from PlayerDetails WHERE playerUuid=@playerUuid', {
    //     playerUuid,
    //   }),
    //   runSelect('SELECT matchUuid from MatchDetails WHERE matchUuid=@matchUuid', {
    //     matchUuid,
    //   }),
    //   runSelect('SELECT contestUuid from ContestDetails WHERE contestUuid=@contestUuid', {
    //     contestUuid,
    //   }),
    //   runSelect('SELECT fantasyTeamUuid from FantasyTeamDetails WHERE fantasyTeamUuid=@fantasyTeamUuid', {
    //     fantasyTeamUuid,
    //   }),
    // ]);
    // if (!((playerId) || (matchId) || (((contestId))) || (fantasyTeamId))) {
    //   error = ' Invalid Entry';
    // }
    const ContestLeaderboardData = {
      contestLeaderUuid,
      playerUuid,
      contestUuid,
      fantasyTeamUuid,
      matchUuid,
      points: Spanner.float(parseFloat(points)),
      isCaptain,
      isVCaptain,
      ball_count: 0,
      contestStatus: contestStatus['scheduled'],
      createdTS: new Date(),
      lastUpdatedTS: new Date(),
    };
    // if (!error) {
      await mutateInsert('ContestLeaderboard', ContestLeaderboardData)
        .catch(error =>{
          logger.error({ methodName: 'createContestLeaderboard',error, resourceType : 'ContestLeaderboard' })
          reject({
            status:INTERNAL_ERROR
          }
          )
        });
      // await RedisServer.setRedisKey(contestLeaderUuid, JSON.stringify(ContestLeaderboardData), REDIS_BUCKET.CONTEST_LEADERBOARD);
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `Contest Leaderboard Insert took ${Date.now() - startTime} ms`,
      });
      // send response and perform in backgroud for caching
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          contestLeaderUuid,
          playerUuid,
          contestUuid,
          fantasyTeamUuid,
        },
      });
    // }
    reject({
      status: NOT_FOUND,
      message: INVALID_INPUT,
    });
  } catch (error) {
    logger.error(error, { methodName: 'createContestLeaderboard', error, resourceType: 'ContestLeaderboard' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getAllContestLeaderboard
 * Description: Returns all the Contests
 * @param {*} params
 * @returns
 *
 * Exceptions: Throws Exception on No ContestLeaderboard Found
 * -
 */
exports.getAllContestLeaderboard = () =>
  new Promise(async (resolve, reject) => {
    try {
      const startTime = Date.now()
      let contestsLeaderboarList = []
      // const contestLeaderboardRecord = await RedisServer.getAllKeyValues(REDIS_BUCKET.CONTEST_LEADERBOARD);
      // Object.values(contestLeaderboardRecord).forEach((item) => {
      //   contestsLeaderboarList.push(JSON.parse(item));
      // });
      // if (!(Array.isArray(contestsLeaderboarList) && contestsLeaderboarList.length)) {
      contestsLeaderboarList = await runSelect(
        'SELECT contestLeaderUuid, contestUuid, matchUuid, playerUuid, fantasyTeamUuid, isCaptain, isVCaptain, ball_count, points, contestStatus from ContestLeaderboard',
      ).catch(error =>{
        logger.error({ methodName: 'getAllContestLeaderboard',error, resourceType : 'ContestLeaderboard' })
        reject({
          status:INTERNAL_ERROR
        });
      });
      // }
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `PlayerLeaderboard Fetched took ${Date.now() - startTime} ms`,
      })
      // send response and perform in backgroud for caching
      if (contestsLeaderboarList) {
        resolve({
          status: SUCCESS,
          message: FOUND_SUCCESS,
          data: {
            PlayerLeaderboardCount: contestsLeaderboarList.length,
            contestsLeaderboarList,
          },
        })
      }
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          PlayerLeaderboardCount: contestsLeaderboarList.length,
          contestsLeaderboarList,
        },
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


/**
 * Function Name: getContestLeaderboardByID
 * Description: Returns Contest Leaderboard by contestLeaderUuid
 * @param {contestLeaderUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid contestLeaderUuid
 * -
 */
exports.getContestLeaderboardByID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let contestLeaderboardRecord = [];
    // contestLeaderboardRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.CONTEST_LEADERBOARD);
    // contestLeaderboardRecord = JSON.parse(contestLeaderboardRecord);
    // if (!contestLeaderboardRecord) {
    contestLeaderboardRecord = await runSelect('SELECT contestLeaderUuid, contestUuid, matchUuid, playerUuid, fantasyTeamUuid, isCaptain, isVCaptain, ball_count, points, contestStatus from ContestLeaderboard WHERE contestLeaderUuid=@contestLeaderUuid', {
      contestLeaderUuid: params,
    }).catch(error =>{
      logger.error({ methodName: 'getContestLeaderboardByID', error, resourceType : 'ContestLeaderboard' })
      reject({
        status:INTERNAL_ERROR
      })
    });;
    // if (Array.isArray(contestLeaderboardRecord) && contestLeaderboardRecord.length) {
    //   contestLeaderboardRecord = contestLeaderboardRecord[0];
    //   await RedisServer.setRedisKey(params, JSON.stringify(contestLeaderboardRecord), REDIS_BUCKET.CONTEST_LEADERBOARD);
    // }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `contestLeaderboard Fetched BY ID took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(contestLeaderboardRecord) && contestLeaderboardRecord.length)) {
      // if ((Array.isArray(contestLeaderboardRecord) && contestLeaderboardRecord.length) || (contestLeaderboardRecord && Object.keys(contestLeaderboardRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          contestLeaderboard: contestLeaderboardRecord,
        },
      });

      // if (Array.isArray(contestLeaderboardRecord) && contestLeaderboardRecord.length) {
      //   contestLeaderboardRecord = contestLeaderboardRecord[0];
      //   await RedisServer.setRedisKey(params, JSON.stringify(contestLeaderboardRecord), REDIS_BUCKET.CONTEST_LEADERBOARD);
      // }
      // }
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `contestLeaderboard Fetched BY ID took ${Date.now()
          - startTime} ms`,
      });
      // send response and perform in backgroud for caching
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_CONTEST_LEADERBOARD_ID,
    });
  } catch (error) {
    logger.error(error, {
      methodName: 'ContestLeaderboard',
      error,
      resourceType: 'ContestLeaderboard',
    });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getContestLeaderboardByContestID
 * Description: Returns Contest Leaderboard by contestUuid
 * @param {contestUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid contestUuid
 * -
 */
exports.getContestLeaderboardByContestID = params =>
  new Promise(async (resolve, reject) => {
    try {
      const startTime = Date.now()
      let contestLeaderboardRecord = []
      // contestLeaderboardRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.CONTEST_LEADERBOARD);
      // contestLeaderboardRecord = JSON.parse(contestLeaderboardRecord);
      // if (!contestLeaderboardRecord) {
      contestLeaderboardRecord = await runSelect(
        'SELECT contestLeaderUuid,contestUuid,matchUuid,playerUuid,fantasyTeamUuid from ContestLeaderboard WHERE contestUuid=@contestUuid ORDER BY fantasyTeamUuid',
        {
          contestUuid: params,
        },
      ).catch(error =>{
        logger.error( {
          methodName: 'ContestLeaderboard',error,resourceType: 'ContestLeaderboard',
        })
        reject({
          status:INTERNAL_ERROR
        })
        
      })
      // if (Array.isArray(contestLeaderboardRecord) && contestLeaderboardRecord.length) {
      //   contestLeaderboardRecord = contestLeaderboardRecord[0];
      //   await RedisServer.setRedisKey(params, JSON.stringify(contestLeaderboardRecord), REDIS_BUCKET.CONTEST_LEADERBOARD);
      // }
      // }
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `ContestLeaderboard Fetched BY Contest ID took ${Date.now() -
          startTime} ms`,
      })
      // send response and perform in backgroud for caching
      if (
        Array.isArray(contestLeaderboardRecord) &&
        contestLeaderboardRecord.length
      ) {
        // if ((Array.isArray(contestLeaderboardRecords) && contestLeaderboardRecords.length) || (contestLeaderboardRecords && Object.keys(contestLeaderboardRecords).length)) {
        resolve({
          status: SUCCESS,
          message: FOUND_SUCCESS,
          data: {
            contestLeaderboard: contestLeaderboardRecord,
          },
        })
      }
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          contestLeaderboard: contestLeaderboardRecord,
        },
      });
    
  } catch (error) {
    logger.error(error, {
      methodName: 'ContestLeaderboard',
      error,
      resourceType: 'ContestLeaderboard',
    });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
