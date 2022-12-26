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

/* eslint-disable import/order */
/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */

const { PubSub } = require('@google-cloud/pubsub');
const logger = require('./logger');
const { SUCCESS, METHODNOTALLOWED } = require('../config/status-codes');
const fs = require('fs');
// const { sfmc } = require('../functions');

const serviceAccountData = JSON.parse(fs.readFileSync(`../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`));

const projectId = serviceAccountData.project_id;
const pubSubClient = new PubSub({
  projectId,
  keyFilename: `../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`,
});
let i = 0;
let j = 0;
// eslint-disable-next-line consistent-return
exports.getTopicName = getTopicName = (params) => {
  try {
    if (params.topics) {
      const resultVal = params.topics.split(' ');
      if (params.type === 'sfmc') {
        const resultSfmc = resultVal[++j];
        if (!resultSfmc) {
          j = 0;
          return resultVal[0];
        }
        return resultSfmc;
      }
      const resultOtp = resultVal[++i];
      if (!resultOtp) {
        i = 0;
        return resultVal[0];
      }
      return resultOtp;
    }
    const error = {
      status: METHODNOTALLOWED,
      message: "topic can't be empty",

    };
    throw (error);
  } catch (error) {
    logger.error(error, { methodName: 'getTopicName', error, resourceType: 'pubsub' });
  }
};

const publishToPubsub = (topic, text) => new Promise(async (resolve, reject) => {
  try {
    const dataBuffer = Buffer.from(JSON.stringify(text));
    await pubSubClient.topic(topic).publish(dataBuffer);
    resolve(true);
  } catch (error) {
    logger.error(error, { methodName: 'publishToPubsub', error, resourceType: 'pubsub' });

    reject(error);
  }
});

// eslint-disable-next-line consistent-return
exports.publishMessage = params => new Promise(async (resolve, reject) => {
  try {
    let topic = '';
    let text = '';
    if(params.topic){
      topic = params.topic;
      text = params;
    }
    if (!topic) {
      logger.error('Topic Not Found', {
        methodName: 'publishToPubsub', error: 'Topic Not Found', resourceType: 'pubsub', params,
      });
      return resolve(false);
    }
    publishToPubsub(topic, text);
    // sfmc(JSON.stringify(text));
    resolve({ status: SUCCESS });
  } catch (error) {
    logger.error(error, { methodName: 'publishToPubsub', error, resourceType: 'pubsub' });
    resolve(false); // resolving because it should not stop other activities
  }
});
