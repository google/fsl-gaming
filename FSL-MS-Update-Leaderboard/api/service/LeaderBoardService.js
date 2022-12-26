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
/* eslint-disable no-multi-assign */

const { INTERNAL_ERROR, SUCCESS } = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { getFSLRedis } = require('../../../FSL-Backend-Common/redis/redisProvider');
const { SAVE_SUCCESS } = require('../../../FSL-Backend-Common/config/strings');
const RedisService = getFSLRedis()

/**
 * Function Name: updateContestLeaderBoard
 * Description: This function updates the points for fantasy team for the particular Contest
 * @param {} params 
 * @returns 
 * 
 * Exceptions: Throws Not found exeption if the given Contest Id is invalid or Server Error if any
 * - 
 */

exports.updateContestLeaderBoard = params => new Promise(async (resolve, reject) => {
  try {
    const { data } = params
    const startTime = Date.now();
    const isSuccess = await RedisService.incrementZRedisKeyBatch(data);
    if (isSuccess) {
      logger.debug({
        benchMark: true,
        responseTime: `${Date.now() - startTime} ms`,
        message: `Redis update ContestLeaderBoard took ${Date.now() - startTime}ms for ${data.length} results`,
      });
      // send response and perform in background for caching
      resolve("OK");
    }
    else {
      reject({
        status: INTERNAL_ERROR
      });
    }

  } catch (error) {
    logger.error(error, { methodName: 'updateContestLeaderBoard', error, resourceType: 'LeaderBoard' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});


/**
 * Function Name: updateFLPlayerLeaderBoard
 * Description: This function updates the points for each player for the particular fantasy team and retuns the success message to user
 * @param {} params 
 * @returns 
 * 
 * Exceptions: Throws Not found exeption if the given Fantasy team Id is invalid or Server Error if any
 * - 
 */
exports.updateFLPlayerLeaderBoard = params => new Promise(async (resolve, reject) => {
  try {
    const { data } = params
    const startTime = Date.now();
    const isSuccess = await RedisService.incrementZRedisKeyBatch(data);
    if (isSuccess) {
      logger.debug({
        benchMark: true,
        responseTime: `${Date.now() - startTime} ms`,
        message: `Redis update FLPlayerLeaderBoard took ${Date.now() - startTime}ms for ${data.length} results`,
      });
      // send response and perform in backgroud for caching
      resolve("OK");
    }
    else {
      resolve({
        status: INTERNAL_ERROR
      });
    }
  } catch (error) {
    logger.error(error, { methodName: 'updateFLPlayerLeaderBoard', error, resourceType: 'LeaderBoard' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});