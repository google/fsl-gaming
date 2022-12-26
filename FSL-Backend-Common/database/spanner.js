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

/* eslint-disable consistent-return */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-shadow */
/* eslint-disable no-lone-blocks */
/* eslint-disable array-callback-return */

// Imports the Google Cloud client library
const { Spanner } = require('@google-cloud/spanner');
const fs = require('fs');
const { MAX_MUTATION, SECONDARY_INDEXES } = require('../config/constants');
const logger = require('../utils/logger');

const serviceAccountData = JSON.parse(fs.readFileSync(`../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`));

const projectId = serviceAccountData.project_id;

// Creates a client
const spanner = new Spanner({
  projectId,
  keyFilename: `../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`,

});

// Gets a reference to a Cloud Spanner instance
const instance = spanner.instance('dev-fsl-gaming');
exports.database = instance.database('dev-fsl-gaming');
exports.Spanner = Spanner;

// Method to insert/update/delete records using DML Queries:
exports.dmlUpdate = (query, params) => new Promise(async (resolve, reject) => {
  this.database.runTransaction(async (err, transaction) => {
    if (err) {
      logger.debug({ methodName: 'dmlUpdate', resourceType: 'spanner', query });
      logger.error(err, { methodName: 'dmlUpdate', error: err, resourceType: 'spanner' });
      return reject(err);
    }
    try {
      const [rowCount] = await transaction.runUpdate({
        sql: query,
        params,
      });
      await transaction.commit();
      resolve(rowCount);
    } catch (error) {
      logger.error(error, {
        methodName: 'dmlUpdate', error, resourceType: 'spanner', query, params,
      });
      reject(error);
    }
  });
});


// Method to update using mutate:
exports.mutateUpdate = (table, dataset) => new Promise((resolve, reject) => {
  this.database.runTransaction(async (err, transaction) => {
    if (err) {
      logger.error(err, { methodName: 'mutateUpdate', error: err, resourceType: 'spanner' });
      return reject(err);
    }
    try {
      const startTime = new Date()
      await transaction.update(table, dataset);
      await transaction.commit();
      logger.info({
        responseTime: `${Date.now() - startTime} ms`,
        info: `Time taken to mutateUpdate to spanner`,
        dataLength: dataset.length
      })
      resolve(true);
    } catch (error) {
      logger.error(error, {
        methodName: 'mutateUpdate', error, resourceType: 'spanner', table, dataset,
      });
      reject(error);
    }
  });
});


// Method to insert using mutate:
exports.mutateInsert = (table, dataset) => new Promise(async (resolve, reject) => {
  const tableToInsert = this.database.table(table);
  try {
    await tableToInsert.insert(dataset);
    resolve(true);
  } catch (error) {
    logger.error(error, {
      methodName: 'mutateInsert', error, resourceType: 'spanner', table, dataset,
    });
    reject(error);
  }
});

// Method to run SELECT queries:
exports.runSelect = (query, params) => new Promise(async (resolve, reject) => {
  try {
    const [rows] = await this.database.run({
      sql: query,
      params,
    });

    const finalResult = rows.map((each) => {
      const json = each.toJSON();
      const eachObject = {};
      each.map((prop) => {
        eachObject[prop.name] = json[prop.name];
      });
      return eachObject;
    });
    resolve(finalResult);
  } catch (error) {
    logger.error(error, {
      methodName: 'runSelect', error, resourceType: 'spanner', query, params,
    });
    reject(error);
  }
});


exports.bulkInsert = (tableName, dataArray) => new Promise(async (resolve, reject) => {
  try {
    const rowCount = dataArray.length;
    const columns = Object.keys(dataArray[0]).length + SECONDARY_INDEXES[tableName]
    const totalMutations = rowCount * columns;
    const promiseArray = [];

    if (totalMutations < MAX_MUTATION) {
      promiseArray.push(this.mutateInsert(tableName, dataArray));
    } else {
      const upperLimit = Math.floor(MAX_MUTATION / columns);
      let i = 0;
      let j = upperLimit;
      const limit = rowCount - (rowCount % upperLimit);

      for (i, j; j <= limit;) {
        const bulk = dataArray.slice(i, j);
        promiseArray.push(this.mutateInsert(tableName, bulk));
        i = j;
        j += upperLimit;
      }
      const remainingBulk = dataArray.slice(i);
      if (remainingBulk.length) {
        promiseArray.push(this.mutateInsert(tableName, remainingBulk));
      }
    }
    await Promise.all(promiseArray);
    resolve(true);
  } catch (error) {
    logger.error(error, { methodName: 'bulkInsert', error, resourceType: 'spanner' });
    reject(error);
  }
});

exports.bulkUpdate = (tableName, dataArray) => new Promise(async (resolve, reject) => {
  try {
    const rowCount = dataArray.length;
    const columns = Object.keys(dataArray[0]).length + SECONDARY_INDEXES[tableName];;
    const totalMutations = rowCount * columns;
    const promiseArray = [];

    if (totalMutations < MAX_MUTATION) {
      promiseArray.push(this.mutateUpdate(tableName, dataArray));
    } else {
      const upperLimit = Math.floor(MAX_MUTATION / columns);
      let i = 0;
      let j = upperLimit;
      const limit = rowCount - (rowCount % upperLimit);

      for (i, j; j <= limit;) {
        const bulk = dataArray.slice(i, j);
        promiseArray.push(this.mutateUpdate(tableName, bulk));
        i = j;
        j += upperLimit;
      }
      const remainingBulk = dataArray.slice(i);
      if (remainingBulk.length) {
        promiseArray.push(this.mutateUpdate(tableName, remainingBulk));
      }
    }
    const startTime = new Date()
    await Promise.all(promiseArray);
    logger.info({
      'responseTime': `${Date.now() - startTime} ms`,
      'message': `Time taken to update ${promiseArray.length} records to spanner ${Date.now() - startTime} ms`,
      'dataLength': promiseArray.length,
      'individualDataLength': promiseArray[0].length
    })
    resolve(true);
  } catch (error) {
    logger.error(error, { methodName: 'bulkUpdate', error, resourceType: 'spanner' });
    reject(error);
  }
});
