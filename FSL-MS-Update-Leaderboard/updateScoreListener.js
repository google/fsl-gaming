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
const { URLS } = require('../FSL-Backend-Common/config/constants');


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
                    let result = JSON.parse(dataReceived);
                    
                    delete result['topic'];
                    logger.debug({
                        message: `/updateScore Called`,
                        dataReceived: dataReceived
                    })
                    axios.patch(`${URLS[process.env.NODE_ENV]['resource-management']}/score`, result)
                    .then(()=>null).catch ((error)=>{
                        logger.error(error, { methodName: 'UpdateScoreListenForMessages', error, resourceType: 'spanner' });
                    })
                    return true
                } catch (error) {
                    logger.error(error, { methodName: 'messageHandler', error, resourceType: 'spanner' });
                    return message.ack();
                }
            };

            subscription.on('message', messageHandler);
        } catch (error) {
            logger.error(error, { methodName: 'UpdateScoreListenForMessages', error, resourceType: 'spanner' });
        }
    }

    if (process.env.PUBSUB_UPDATE_SCORE_SUBSCRIPTION_ID) {
        listenForMessages(process.env.PUBSUB_UPDATE_SCORE_SUBSCRIPTION_ID);
    }
}
main();