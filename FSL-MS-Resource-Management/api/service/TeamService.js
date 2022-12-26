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
/* eslint-disable no-multi-assign */
// eslint-disable-next-line max-len
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-unused-expressions
// eslint-disable-next-line no-console
// eslint-disable-next-line no-console
// eslint-disable-next-line no-undef

const { INTERNAL_ERROR, SUCCESS, NOT_FOUND } = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { mutateInsert, runSelect, mutateUpdate } = require('../../../FSL-Backend-Common/database/spanner');
const { teamSize } = require('../../../FSL-Backend-Common/config/constants');
const {
  SAVE_SUCCESS, FOUND_SUCCESS, INVALID_TEAM_ID, NO_TEAM_FOUND,
} = require('../../../FSL-Backend-Common/config/strings');
const { v4: uuidv4 } = require('uuid');
const { generateName } = require('../../../FSL-Backend-Common/methods/generateName');

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');
// const RedisServer = getFSLResourceManagement();

/**
 * Function Name: createTeam
 * Description:  Creates the Team
 * @param {*} params
 * @returns
 *
 * Exceptions: None
 * -
 */
exports.createTeam = () => new Promise(async (resolve, reject) => {
  try {
    const availablePlayers = teamSize[Math.floor(Math.random() * teamSize.length)];
    const startTime = Date.now();
    const teamUuid = uuidv4();
    const teamName = `team-${generateName()}`;
    const teamData = {
      teamUuid,
      teamName,
      availablePlayers,
      createdTS: new Date(),
      lastUpdatedTS: new Date(),
    };
    await mutateInsert('TeamDetails', teamData)
    .catch(error =>{
      reject(
        logger.error({ methodName: 'createTeam ', error, resourceType: 'Team' })
      )
      });
    // await RedisServer.setRedisKey(teamUuid, JSON.stringify(teamData), REDIS_BUCKET.TEAM_DETAILS);
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `TeamDetails Insert took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    resolve({
      status: SUCCESS,
      message: SAVE_SUCCESS,
      data: {
        teamUuid,
        teamName,
        availablePlayers,
      },
    });
  } catch (error) {
    logger.error(error, { methodName: 'createTeam', error, resourceType: 'team' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getTeambyID
 * Description: Returns the Team by passing teamUuid
 * @param {teamUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid teamUuid
 * -
 */
exports.getTeambyID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let teamRecord = [];
    // let teamRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.TEAM_DETAILS);
    // teamRecord = JSON.parse(teamRecord);
    // if (!teamRecord) {
    teamRecord = await runSelect('SELECT teamUuid, teamName, availablePlayers from TeamDetails WHERE teamUuid=@teamUuid', {
      teamUuid: params,
    }) 
    .catch(error =>{
      reject(
        logger.error({ methodName: 'getTeambyID', error, resourceType: 'Team' })
      )
      });
    // if (Array.isArray(teamRecord) && teamRecord.length) {
    //   teamRecord = teamRecord[0];
    //   await RedisServer.setRedisKey(params, JSON.stringify(teamRecord), REDIS_BUCKET.TEAM_DETAILS);
    // }
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `TeamDetails Fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if ((Array.isArray(teamRecord) && teamRecord.length)) {
      // below is used for redis
      // if ((Array.isArray(teamRecord) && teamRecord.length) || (teamRecord && Object.keys(teamRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data:
          teamRecord,
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_TEAM_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getTeambyID', error, resourceType: 'team' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getAllTeams
 * Description: Returns all the Team
 * @param {*} params
 * @returns
 *
 * Exceptions: Throws Exception on No Teams Found
 * -
 */
exports.getAllTeams = () => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let teamList = [];
    // const teamData = await RedisServer.getAllKeyValues(REDIS_BUCKET.TEAM_DETAILS);
    // Object.values(teamData).forEach((item) => {
    //   teamList.push(JSON.parse(item));
    // });
    // if (!(Array.isArray(teamList) && teamList.length)) {
    teamList = await runSelect('SELECT teamUuid, teamName, availablePlayers from TeamDetails')
    .catch(error =>{
      reject(
        logger.error({ methodName: 'getAllTeams', error, resourceType: 'Team' })
      )
      });
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: ` All Team Details Fetched took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (teamList && teamList.length > 0) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          teamCount: teamList.length,
          teamList,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_TEAM_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getAllTeams', error, resourceType: 'team' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: updateTeam
 * Description: Returns updated teamName and availablePlayers for the Team
 * @param {teamUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid teamUuid
 * -
 */

exports.updateTeam = (id, params) => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    const { teamName, availablePlayers } = params;
    let teamRecord = [];
    // let teamDetails = await RedisServer.getRedisKey(id, REDIS_BUCKET.TEAM_DETAILS);
    // teamDetails = JSON.parse(teamDetails);
    // teamDetails.teamName = teamName;
    // teamDetails.availablePlayers = availablePlayers;
    // teamDetails.lastUpdatedTS = new Date();
    teamRecord = await runSelect('SELECT teamUuid from TeamDetails WHERE teamUuid=@teamUuid', {
      teamUuid: id,
    }) 
    .catch(error =>{
      reject(
        logger.error({ methodName: 'updateTeam', error, resourceType: 'Team' })
      )
      });
    const teamData = {
      teamUuid: id,
      teamName,
      availablePlayers,
      lastUpdatedTS: new Date(),
    };
    // if (Array.isArray(teamRecord) && teamRecord.length) {
    await mutateUpdate('TeamDetails', teamData) 
    .catch(error =>{
      reject(
        logger.error({ methodName: 'updateTeam', error, resourceType: 'Team' })
      )
      });
    // await RedisServer.setRedisKey(id, JSON.stringify(teamDetails), REDIS_BUCKET.TEAM_DETAILS);
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `Team update took ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    resolve({
      status: SUCCESS,
      message: SAVE_SUCCESS,
      data: {
        teamName,
        availablePlayers,
      },
    });
    // }
    reject({
      status: NOT_FOUND,
      message: INVALID_TEAM_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'updateTeam', error, resourceType: 'team' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
