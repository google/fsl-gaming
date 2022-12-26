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


const {
  INTERNAL_ERROR, SUCCESS, NOT_FOUND, BAD_REQUEST,
} = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { mutateInsert, runSelect } = require('../../../FSL-Backend-Common/database/spanner');
const { v4: uuidv4 } = require('uuid');

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');

// const RedisServer = getFSLResourceManagement();

/* eslint-disable no-multi-assign */
// const { REDIS_BUCKET } = require('../../../FSL-Backend-Common/config/constants');

const {
  SAVE_SUCCESS, CONTEST_FULL, FOUND_SUCCESS, INVALID_FANTASYTEAM_ID, INVALID_USER_ID, INVALID_CONTEST_ID,
} = require('../../../FSL-Backend-Common/config/strings');

/**
 * Function Name: createFantasyTeamDetails
 * Description:  Creates the FantasyTeam by passing userUuid and contestUuid
 * @param {userUuid and contestUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid userUuid and contestUuid
 * -
 */
exports.createFantasyTeamDetails = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const fantasyTeamUuid = uuidv4();
    const { userUuid, contestUuid } = params;
    const createdTS = new Date();
    const lastUpdatedTS = new Date();
    let error = '';
    const [contestRecord, fantasyTeamId] = await Promise.all([
      // runSelect('SELECT userUuid from UserDetails WHERE userUuid=@userUuid', {
      //   userUuid,
      // }),
      runSelect('SELECT contestUuid,team1Uuid,team2Uuid,slot,contestStatus from ContestDetails WHERE contestUuid=@contestUuid', {
        contestUuid,
      }),

      // TODO: Optimize
      runSelect('SELECT COUNT(*) FROM fantasyTeamDetails WHERE contestUuid=@contestUuid', {
        contestUuid,
      }),

      // runSelect('SELECT ContestLeaderUuid from ContestLeaderboard WHERE fantasyTeamUuid=@fantasyTeamUuid', {
      //   fantasyTeamUuid,
      // }),
    ]).catch((error) =>{
      logger.error({ methodName: 'createFantasyTeamDetails', error, resourceType: 'Fantasy' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    // if (!(Array.isArray(userRecord) && userRecord.length)) {
    //   error = 'userUuid ';
    // }
    // if (!(Array.isArray(contestRecord) && contestRecord.length)) {
    //   error += error ? ' && contestUuid' : 'contestUuid';
    // }
    if ((fantasyTeamId.length > contestRecord[0].slot)) {
      error = 'Contest Full';
    }
    if (!error && contestRecord[0].contestStatus === 'SCHEDULED') {
      const { team1Uuid } = contestRecord[0];
      const { team2Uuid } = contestRecord[0];
      const FantasyTeamData = {
        fantasyTeamUuid,
        userUuid,
        contestUuid,
        team1Uuid,
        team2Uuid,
        createdTS,
        lastUpdatedTS,
      };
      await mutateInsert('FantasyTeamDetails', FantasyTeamData)
      .catch((error) =>{
        logger.error({ methodName: 'createFantasyTeamDetails', error, resourceType: 'Fantasy' })
        reject({
          status:INTERNAL_ERROR
        });
      });
      // await RedisServer.setRedisKey(fantasyTeamUuid, JSON.stringify(FantasyTeamData), REDIS_BUCKET.FANTASY_TEAM_DETAILS);
      logger.debug({
        benchMark: false,
        responseTime: `${Date.now() - startTime}`,
        message: `Fantasy Team Details Insert took ${Date.now() - startTime} ms`,
      });
      // send response and perform in backgroud for caching
      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          fantasyTeamUuid,
          userUuid,
          contestUuid,
          team1Uuid,
          team2Uuid,
        },
      });
    }
    if (contestRecord[0].contestStatus !== 'SCHEDULED') {
      reject({
        status: BAD_REQUEST,
        message: 'Match already started',
      });
    }
    if (error === 'Contest Full') {
      reject({
        status: BAD_REQUEST,
        message: CONTEST_FULL,
      });
    } else if (error) {
      reject({
        status: NOT_FOUND,
        message: `${error} not found`,
      });
    }
  } catch (error) {
    logger.error(error, { methodName: 'fantasyTeamDetails', error, resourceType: 'FantasyTeamDetails' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getFantasyTeamsDetailsByID
 * Description: Returns FantasyTeamsDetails by passing fantasyTeamUuid
 * @param {fantasyTeamUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid fantasyTeamUuid
 * -
 */
exports.getFantasyTeamsDetailsByID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let fantasyTeamRecord = [];
    // fantasyTeamRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.FANTASY_TEAM_DETAILS);
    // fantasyTeamRecord = JSON.parse(fantasyTeamRecord);
    // if (!fantasyTeamRecord) {
    fantasyTeamRecord = await runSelect('SELECT fantasyTeamUuid, userUuid, contestUuid, team1Uuid, team2Uuid from FantasyTeamDetails WHERE fantasyTeamUuid=@fantasyTeamUuid', {
      fantasyTeamUuid: params,
    }).catch((error) =>{
      logger.error({ methodName: 'getFantasyTeamsDetailsByID', error, resourceType: 'Fantasy' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    // if (Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length) {
    //   fantasyTeamRecord = fantasyTeamRecord[0];
    //   await RedisServer.setRedisKey(params, JSON.stringify(fantasyTeamRecord), REDIS_BUCKET.FANTASY_TEAM_DETAILS);
    // }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: ` Fantasy Teams Details By ID Fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length)) {
      // if ((Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length) || (fantasyTeamRecord && Object.keys(fantasyTeamRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          fantasyTeamsDetails: fantasyTeamRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_FANTASYTEAM_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getFantasyTeamsDetailsByID', error, resourceType: 'FantasyTeamDetails' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getFantasyTeamsDetailsByUserID
 * Description: Returns FantasyTeamsDetails by passing userUuid
 * @param {userUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid userUuid
 * -
 */
exports.getFantasyTeamsDetailsByUserID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let fantasyTeamRecord = [];
    // fantasyTeamRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.FANTASY_TEAM_DETAILS);
    // fantasyTeamRecord = JSON.parse(fantasyTeamRecord);
    // if (!fantasyTeamRecord) {
    fantasyTeamRecord = await runSelect('SELECT fantasyTeamUuid, userUuid, contestUuid, team1Uuid, team2Uuid from FantasyTeamDetails WHERE userUuid=@userUuid', {
      userUuid: params,
    }).catch((error) =>{
      logger.error({ methodName: 'getFantasyTeamsDetailsByUserID', error, resourceType: 'Fantasy' })
      reject({
        status:INTERNAL_ERROR
      });
    });
    // if (Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length) {
    // fantasyTeamRecord = fantasyTeamRecord[0];
    // await RedisServer.setRedisKey(params, JSON.stringify(fantasyTeamRecord), REDIS_BUCKET.FANTASY_TEAM_DETAILS);
    // }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `All Fantasy Teams Details By User ID Fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length)) {
      // if ((Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length) || (fantasyTeamRecord && Object.keys(fantasyTeamRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          fantasyTeamsDetails: fantasyTeamRecord.length,
          fantasyTeamRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_USER_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getFantasyTeamsDetailsByUserID', error, resourceType: 'FantasyTeamDetails' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getFantasyTeamsDetailsByContestID
 * Description: Returns FantasyTeamsDetails by passing contestUuid
 * @param {contestUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid contestUuid
 * -
 */
exports.getFantasyTeamsDetailsByContestID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let fantasyTeamRecord = [];
    // fantasyTeamRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.FANTASY_TEAM_DETAILS);
    // fantasyTeamRecord = JSON.parse(fantasyTeamRecord);
    // if (!fantasyTeamRecord) {
    fantasyTeamRecord = await runSelect('SELECT fantasyTeamUuid, userUuid, contestUuid, team1Uuid, team2Uuid from FantasyTeamDetails WHERE contestUuid=@contestUuid', {
      contestUuid: params,
    }).catch((error) =>{
      logger.error({ methodName: 'getFantasyTeamsDetailsByContestID', error, resourceType: 'Fantasy' })
      reject({
        status:INTERNAL_ERROR
      })
    });
    // if (Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length) {
    // fantasyTeamRecord = fantasyTeamRecord[0];
    // await RedisServer.setRedisKey(params, JSON.stringify(fantasyTeamRecord), REDIS_BUCKET.FANTASY_TEAM_DETAILS);
    //   }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Fantasy Teams Details By Contest ID Fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length)) {
      // if ((Array.isArray(fantasyTeamRecord) && fantasyTeamRecord.length) || (fantasyTeamRecord && Object.keys(fantasyTeamRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          fantasyTeamsDetails: fantasyTeamRecord.length,
          fantasyTeamRecord,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_CONTEST_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getFantasyTeamsDetailsByContestID', error, resourceType: 'FantasyTeamDetails' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
