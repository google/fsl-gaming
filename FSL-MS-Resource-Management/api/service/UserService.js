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
/* eslint prefer-destructuring: ["off", {AssignmentExpression: {array: true}}] */
/* eslint no-shadow: "off" */
/* eslint-disable no-await-in-loop */

const {
  INTERNAL_ERROR, SUCCESS, METHOD_NOT_ALLOWED, NOT_FOUND, INVALID_INPUT,
} = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { mutateInsert, runSelect, mutateUpdate } = require('../../../FSL-Backend-Common/database/spanner');
const { role, USER_SIZE } = require('../../../FSL-Backend-Common/config/constants');
/* eslint-disable no-multi-assign */
// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');

// const RedisServer = getFSLResourceManagement();
const {
  SAVE_SUCCESS, INVALID_USER_ID, FOUND_SUCCESS, INVALID_NUMBER, NO_USER_FOUND,
} = require('../../../FSL-Backend-Common/config/strings');
const { validateMobileNumber } = require('../../../FSL-Backend-Common/utils/utils');
const { v4: uuidv4 } = require('uuid');



/**
 * Function Name: createUser
 * Description:  Creates the User by passing the phoneNumber
 * @param {phoneNumber} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid phoneNumber(10 Digit Phone Number)
 * -
 */
exports.createUser = params => new Promise(async (resolve, reject) => {
  try {
    if (!validateMobileNumber(params.mobileNumber)) {
      return reject({
        status: METHOD_NOT_ALLOWED,
        message: INVALID_NUMBER,
      });
    }
    const startTime = Date.now();
    const userUuid = uuidv4();
    const mobileNumber = parseInt(params.mobileNumber);
    const createdTS = new Date();
    const lastUpdatedTS = new Date();
    const userData = {
      userUuid,
      mobileNumber: parseInt(params.mobileNumber),
      role,
      createdTS,
      lastUpdatedTS,
    };
    await mutateInsert('UserDetails', userData)
    .catch(error =>{
      reject(
        logger.error({ methodName: 'createUser', error, resourceType: 'User' })
      )
      });
    // await RedisServer.setRedisKey(userUuid, JSON.stringify(userData), REDIS_BUCKET.USER_DETAILS);
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `User Created took ${Date.now() - startTime} ms`,
    })
    // send response and perform in backgroud for caching
    resolve({
      status: SUCCESS,
      message: SAVE_SUCCESS,
      data: {
        mobileNumber,
        userUuid,
        role,
      },
    });
  } catch (error) {
    logger.error(error, { methodName: 'createUser', error, resourceType: 'user' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getAllUsers
 * Description: Returns all the Users
 * @param {*} params
 * @returns
 *
 * Exceptions: None
 * -
 */
exports.getAllUsers = () => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let userList = [];
    // let userRecord;
    // userRecord = await RedisServer.getAllKeyValues(REDIS_BUCKET.USER_DETAILS);
    // Object.values(userRecord).forEach((item) => {
    //   userList.push(JSON.parse(item));
    // });
    // if (!(Array.isArray(userList) && userList.length)) {
    userList = await runSelect('SELECT userUuid, mobileNumber, role from UserDetails')
    .catch(error =>{
      reject(
        logger.error({ methodName: 'getAllUsers', error, resourceType: 'User' })
      )
      });
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `All Users Fetched ${Date.now() - startTime} ms`,
    });
    // send response and perform in backgroud for caching
    if (userList && userList.length > 0) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          userCount: userList.length,
          userList,
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: NO_USER_FOUND,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getAllUsers', error, resourceType: 'user' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});

/**
 * Function Name: getUserByID
 * Description: Returns the User by userUuid
 * @param {userUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid userUuid
 * -
 */
exports.getUserByID = params => new Promise(async (resolve, reject) => {
  try {
    const startTime = Date.now();
    let userRecord = [];
    // userRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.USER_DETAILS).catch(err => null);
    // if (userRecord) userRecord = JSON.parse(userRecord);

    // if (!userRecord) {
    userRecord = await runSelect('SELECT userUuid, mobileNumber, role from UserDetails WHERE userUuid=@userUuid', {
      userUuid: params,
    }).catch(error =>{
      reject(
        logger.error({ methodName: 'getUserByID', error, resourceType: 'User' })
      )
      });
    // if (Array.isArray(userRecord) && userRecord.length) {
    //   userRecord = userRecord[0];
    // }
    // await RedisServer.setRedisKey(params, JSON.stringify(userRecord), REDIS_BUCKET.USER_DETAILS);
    // }
    logger.debug({
      benchMark: false,
      responseTime: `${Date.now() - startTime}`,
      message: `UserDetails Fetched BY ID ${Date.now() - startTime} ms`,
    });
    if ((Array.isArray(userRecord) && userRecord.length)) {
      // below is used for redis
      // if ((Array.isArray(userRecord) && userRecord.length) || (userRecord && Object.keys(userRecord).length)) {
      resolve({
        status: SUCCESS,
        message: FOUND_SUCCESS,
        data: {
          userCount: userRecord.length,
          user: userRecord[0],
        },
      });
    }
    reject({
      status: NOT_FOUND,
      message: INVALID_USER_ID,
    });
  } catch (error) {
    logger.error(error, { methodName: 'getUserByID', error, resourceType: 'user' });
    reject({
      status: INTERNAL_ERROR,
    });
  }
});
