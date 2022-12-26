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

/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable consistent-return */

require('dotenv').config();
require('../FSL-Backend-Common/utils/tracing');


const axios = require('axios').default;
const fs = require('fs');
const { PubSub } = require('@google-cloud/pubsub');
const logger = require('../FSL-Backend-Common/utils/logger');
const { checkEnvVariables } = require('../FSL-Backend-Common/methods/checkEnvVariables');
const { Spanner } = require('../FSL-Backend-Common/database/spanner');
const { URLS } = require('../FSL-Backend-Common/config/constants');
const pubsubService = require('../FSL-Backend-Common/utils/pubsub')


const serviceAccountData = JSON.parse(fs.readFileSync(`../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`));
const projectId = serviceAccountData.project_id;


function main() {
    const subscriberOptions = {
        flowControl: {
            maxMessages: 100,
        },
    };

    const pubSubClient = new PubSub({
        projectId,
        keyFilename: `../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`,
    }, subscriberOptions);


    function listenForMessages(PUBSUB_SUBSCRIPTION_ID) {
        try {
            const subscription = pubSubClient.subscription(PUBSUB_SUBSCRIPTION_ID);

            const messageHandler = async (message) => {
                try {
                    message.ack();
                    const dataReceived = message.data.toString();
                    let result = JSON.parse(dataReceived)
                    let appendList = [];
                    result['data'].forEach((res) => {
                        dataForRedis = {};
                        dataForRedis.bucketName = `${res.contestUuid}_${res.fantasyTeamUuid}`;
                        dataForRedis.score = res.isCaptain ? result.score * 2 : (res.isVCaptain ? result.score * 1.5 : result.score);
                        dataForRedis.value = `${res.contestUuid}_${res.fantasyTeamUuid}_${res.playerUuid}`;
                        appendList.push(dataForRedis);
                        res['overCount']=result.overCount;
                        res['points'] = parseFloat(res['points']) + parseFloat(Spanner.float(parseFloat(dataForRedis.score)).value);
                    });

                    logger.info({
                        message: `Score: ${dataForRedis.score} `
                    })
                    const startTime = Date.now();
                    /***
                    * call redis api and update to spanner
                    */
                    await axios.post(`${URLS[process.env.NODE_ENV]['update-leaderboard']}/player-leaderBoard`, {
                        "data": appendList
                    }).then(()=>null).catch(error =>{
                        logger.error({error,methodName:"updateRedisListner",resourceType:"simulator"});
                      });

                    logger.info({
                        responseTime: `${Date.now() - startTime} ms`,
                        message: `Time elapsed: ${Date.now() - startTime} ms`,
                    });

                   let  appendList1 = []
                    result['data'].forEach((res) => {
                        dataForRedis = {};
                        dataForRedis.bucketName = `${res.contestUuid}`;
                        dataForRedis.score = res.isCaptain ? result.score * 2 : (res.isVCaptain ? result.score * 1.5 : result.score);
                        dataForRedis.value = `${res.fantasyTeamUuid}`;
                        appendList1.push(dataForRedis);
                    });

                    const startTime1 = Date.now();
                    /***
                     * call redis api and update to spanner
                     */
                    await axios.post(`${URLS[process.env.NODE_ENV]['update-leaderboard']}/contest-leaderboard`, {
                        "data": appendList1
                    }).then(()=>null).catch(error =>{
                        logger.error({error,methodName:"updateSimulateListner",resourceType:"simulator"});
                      });

                    logger.info({
                        responseTime: `${Date.now() - startTime1} ms`,
                        message: `Time elapsed: ${Date.now() - startTime1} ms`,
                    });
                    pubsubService.publishMessage({ "topic": "pushToSpanner", "data": result['data'] });

                    return true
                } catch (error) {
                    logger.error(error, { methodName: 'messageHandler', error, resourceType: 'spanner' });
                    return message.ack();
                }
            };

            subscription.on('message', messageHandler);
        } catch (error) {
            logger.error(error, { methodName: 'listenForMessages', error, resourceType: 'spanner' });
        }
    }

    if (process.env.PUBSUB_REDIS_SUBSCRIPTION_ID) {
        listenForMessages(process.env.PUBSUB_REDIS_SUBSCRIPTION_ID);
    }
}
checkEnvVariables();
main();