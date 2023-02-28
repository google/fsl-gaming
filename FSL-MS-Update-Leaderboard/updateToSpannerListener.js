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

const fs = require('fs');
const { PubSub } = require('@google-cloud/pubsub');
const logger = require('../FSL-Backend-Common/utils/logger');
const { checkEnvVariables } = require('../FSL-Backend-Common/methods/checkEnvVariables');
const { bulkUpdate, Spanner } = require('../FSL-Backend-Common/database/spanner');


const serviceAccountData = JSON.parse(fs.readFileSync(`../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`));
const projectId = serviceAccountData.project_id;

function main() {
    // Imports the Google Cloud client library
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
            // References an existing subscription
            const subscription = pubSubClient.subscription(PUBSUB_SUBSCRIPTION_ID);

            // Create an event handler to handle messages
            const messageHandler = async (message) => {
                try {
                    message.ack()
                    const dataReceived = message.data.toString();
                    let result = JSON.parse(dataReceived)
                    let overCount;
                    result['data'].forEach((data)=>{
                        data['points'] = Spanner.float(parseFloat(data['points']))
                        overCount=data['overCount']
                        delete data['overCount'];
                    })
                    logger.info({
                        message:`Spanner Upadte for ball ${overCount}`
                    })
                    bulkUpdate("ContestLeaderboard", result['data'])
                    
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


    if (process.env.PUBSUB_SUBSCRIPTION_ID) {
        listenForMessages(process.env.PUBSUB_SUBSCRIPTION_ID);
    }
}

checkEnvVariables();
main();