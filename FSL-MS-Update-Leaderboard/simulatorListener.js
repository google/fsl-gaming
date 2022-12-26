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
const axios = require('axios').default;
const { PubSub } = require('@google-cloud/pubsub');
const logger = require('../FSL-Backend-Common/utils/logger');
const { checkEnvVariables } = require('../FSL-Backend-Common/methods/checkEnvVariables');
const { URLS } = require('../FSL-Backend-Common/config/constants');
const { runSelect } = require('../FSL-Backend-Common/database/spanner');
const pubsubService = require('../FSL-Backend-Common/utils/pubsub')

const serviceAccountData = JSON.parse(fs.readFileSync(`../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`));
const projectId = serviceAccountData.project_id;

function main() {
    logger.info({
        message: `Listening for messages`
    });
    // Imports the Google Cloud client library
    const subscriberOptions = {
        flowControl: {
            maxMessages: 100,
        },
    };

    //creating new PubSubClient
    const pubSubClient = new PubSub({
        projectId,
        keyFilename: `../FSL-Backend-Common/credentials/project-${process.env.NODE_ENV}/service_account_key.json`,
    }, subscriberOptions);

    //Listner function to listen to message from pubsub based on subscription Id
    function listenForMessages(PUBSUB_SUBSCRIPTION_ID) {
        try {
            // References an existing subscription
            const subscription = pubSubClient.subscription(PUBSUB_SUBSCRIPTION_ID);

            // Create an event handler to handle messages
            const messageHandler = async (message) => {
                try {
                    message.ack();
                    const dataReceived = message.data.toString();
                    let result = JSON.parse(dataReceived);
                    let score = 0.0
                    let playerToUpdate
                    switch (result.ball) {
                        case 'WICKET':
                            if (result['wicketType'] == 'LBW' || result['wicketType'] == 'BOWLED') {
                                score = 18.0
                                playerToUpdate = result.bowler
                            }
                            else {
                                score = 10.0
                                playerToUpdate = result.bowler
                            }
                            break
                        case 'BOUNDARY':
                            score = result.run + 2.0
                            playerToUpdate = result.onCreaseBatsman
                            break;
                        default:
                            if (typeof (result.run) == 'number') {
                                score = result.run
                                playerToUpdate = result.onCreaseBatsman
                            }
                            break
                    }
                    if (score > 0) {
                        let dataPacket = {
                            "matchUuid": result.matchUuid,
                            "playerUuid": playerToUpdate,
                            "points": parseFloat(score)
                        }
                        //Get count from ContestLeaderboard
                        let count = await runSelect(`SELECT COUNT(*) AS rowCount FROM ContestLeaderboard WHERE matchUuid=@matchUuid AND playerUuid=@playerUuid`, {
                            matchUuid: result.matchUuid,
                            playerUuid: playerToUpdate
                        }).catch(error => {
                            logger.error(error , { methodName: 'simulatorListener', resourceType: 'spanner' })
                        });
                        logger.info({
                            message: `Count to update :${JSON.stringify(count[0].rowCount)}`
                        })
                        count = count[0].rowCount
                        let loopCount = parseInt(count / 2000);
                        let limtvalue =2000;
                        let offsetValue = 0
                        if (count % 2000 !== 0) {
                            loopCount += 1
                        }
                        for (let i = 0; i < loopCount; i++) {
                            let packet = {
                                "queryData": {
                                    "limitValue": limtvalue,
                                    "offsetValue": offsetValue,
                                    "matchUuid": result.matchUuid,
                                    "playerUuid": playerToUpdate,
                                },
                                "overCount":`${result.OverCount} . ${result.ballCount}`,
                                "points": parseFloat(score),
                                "topic": "updateScore"
                            }
                            offsetValue += 2000;

                            //Push to UpdateScore Topic
                            pubsubService.publishMessage(packet);
                        }
                        //updateplayerleaderBoard 
                        axios.patch(`${URLS[process.env.NODE_ENV]['resource-management']}/player-leaderboard-points`, dataPacket)
                        .catch((error) =>{
                            logger.error(error, { message: 'updatePlayerLeaderboardPoints' })})
                    }
                    
                    const startTimeForMatchTimeline = Date.now()
                    //Insert each ball information in spanner 
                    let packetData = {
                        "matchUuid": result.matchUuid,
                        "batsmanUuid": result.onCreaseBatsman,
                        "bowlerUuid": result.currentBolwer,
                        "over_count": result.OverCount,
                        "ball_count": result.ballCount,
                        "score": typeof (result.run) == 'number' ? result.run : (result.run == 'WD' || result.run == 'NB') ? parseInt(1) : parseInt(0),
                        "hasLostWicket": result.isWicketFallen ? result.isWicketFallen : false,
                        "batsmanOutUuid": result.isWicketFallen ? (result.onCreaseBatsmanOut ? result.onCreaseBatsman : result.offCreaseBatsman) : '',
                        "wicketType": result.isWicketFallen ? result.wicketType : '',
                        "hasExtra": !result.isGoodBall,
                        "extraType": result.isGoodBall ? '' : result.extraType,
                    }

                    await axios.post(`${URLS[process.env.NODE_ENV]['resource-management']}/match-timeline`, packetData).catch(error => {
                        logger.error({ error, methodName: "simulateListner", resourceType: "simulator" });
                    });

                    logger.info({
                      responseTime: Date.now() - startTimeForMatchTimeline,
                      matchUuid: result.matchUuid,
                      apiCalled: "createMatchTimeline",
                      
                    });
                    return true
                } catch (error) {
                    logger.error(error, { methodName: 'simulatorListener', error, resourceType: 'spanner' });
                    return message.ack();
                }
            };

            subscription.on('message', messageHandler);
        } catch (error) {
            logger.error(error, { methodName: 'simulatorListener', error, resourceType: 'spanner' });
        }
    }

    if (process.env.PUBSUB_SIMULATOR_SUBSCRIPTION_ID) {
        listenForMessages(process.env.PUBSUB_SIMULATOR_SUBSCRIPTION_ID);
    }
}
checkEnvVariables();
main();