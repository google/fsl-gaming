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

const { INTERNAL_ERROR, SUCCESS } = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { getFSLRedis } = require('../../../FSL-Backend-Common/redis/redisProvider');;
const RedisService = getFSLRedis()

exports.clearRedis = () =>
  new Promise(async (resolve, reject) => {
    try {

        await RedisService.flushRedis()

      resolve({
        status: SUCCESS,
        message: 'DB Flushed'
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
