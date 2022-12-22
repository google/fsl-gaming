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
/* eslint-disable no-multi-assign */

const { v4: uuidv4 } = require('uuid');
const { INTERNAL_ERROR, SUCCESS, NOT_FOUND, BAD_REQUEST } = require('../../../FSL-Backend-Common/config/status-codes');
const logger = require('../../../FSL-Backend-Common/utils/logger');
const { mutateInsert, runSelect, Spanner } = require('../../../FSL-Backend-Common/database/spanner');

// const { getFSLResourceManagement } = require('../../../FSL-Backend-Common/redis/redisProvider');
// const RedisServer = getFSLResourceManagement();

const { SAVE_SUCCESS,INVALID_CONTEST_ID,FOUND_SUCCESS } = require('../../../FSL-Backend-Common/config/strings');

/**
 * Function Name: createMatchResult
 * Description: Creates the MatchResult by passing matchUuid
 * @param {matchUuid} params
 * @returns
 *
 * Exceptions: Throws Exception on invalid matchUuid
 * -
 */
exports.createMatchResult = params => new Promise(async (resolve, reject) => {
    try {
          const startTime = Date.now()
          const { matchUuid } = params
          const createdTS = new Date()
          const contestIds = await runSelect(
            'select contestUuid from ContestDetails where matchUuid=@matchUuid',
            { matchUuid },
          )
          contestIds.forEach(async contestUuid => {
            let limit = 10000
            let offset = 0
            let results = []
            let length = 0
            do {
              results = await runSelect(
                `select fantasyTeamUuid, sum(points) AS totalPoints from ContestLeaderboard where contestUuid=@contestUuid and matchUuid=@matchUuid GROUP BY fantasyTeamUuid LIMIT ${limit} OFFSET ${offset}`,
                {
                  contestUuid: contestUuid.contestUuid,
                  matchUuid: matchUuid,
                },
              ).catch(error => {
                reject(
                  logger.error({
                    methodName: 'createMatchResult',
                    error,
                    resourceType: 'Contest',
                  }),
                )
              })
              length = results.length
              results.forEach(async result => {
                const matchResultUuid = uuidv4()
                const MatchResultData = {
                  matchResultsUuid: matchResultUuid,
                  matchUuid,
                  contestUuid: contestUuid.contestUuid,
                  fantasyTeamUuid: result.fantasyTeamUuid,
                  fantasyTeamScore: Spanner.float(
                    parseFloat(result.totalPoints),
                  ),
                  createdTS,
                }
                mutateInsert('MatchResults', MatchResultData).catch(error => {
                  reject(
                    logger.error({
                      methodName: 'createMatchResult',
                      error,
                      resourceType: 'Contest',
                    }),
                  )
                })
              })
              results = []
              offset = offset + 10000
            } while (length == 10000)
          })
          // await RedisServer.setRedisKey(contestUuid, JSON.stringify(contestData), REDIS_BUCKET.CONTEST_DETAILS);
          logger.debug({
            benchMark: false,
            responseTime: `${Date.now() - startTime}`,
            message: `MatchResult Insert took ${Date.now() - startTime} ms`,
          })
          // send response and perform in backgroud for caching
          resolve({
            status: SUCCESS,
            message: SAVE_SUCCESS,
          })
          //  reject({
          //     status: NOT_FOUND,
          //     message: INVALID_MATCH_ID,
          // });
        } catch (error) {
        logger.error(error, { methodName: 'createMatchResult', error, resourceType: 'Contest' });
        reject({
            status: BAD_REQUEST,
            message: INTERNAL_ERROR,
        });
    }
});

exports.getMatchResultsByContestID = params => new Promise(async (resolve, reject) => {
    try {
        const startTime = Date.now();
        let matchResultRecord = null;
        // matchResultRecord = await RedisServer.getRedisKey(params, REDIS_BUCKET.CONTEST_DETAILS);
        // matchResultRecord = JSON.parse(matchResultRecord);
        // if (!matchResultRecord) {
        matchResultRecord = await runSelect('select fantasyTeamUuid,fantasyTeamScore from MatchResults where contestUuid=@contestUuid ORDER BY fantasyTeamScore DESC', {
            contestUuid: params,
        }).catch((error) => {
            logger.error({ methodName: 'getMatchResultsByContestID', error, resourceType: 'Contest' })
            reject({
                status: INTERNAL_ERROR
            })
        });
        // if (Array.isArray(matchResultRecord) && matchResultRecord.length) {
        //   matchResultRecord = matchResultRecord[0];
        //   await RedisServer.setRedisKey(params, JSON.stringify(matchResultRecord), REDIS_BUCKET.CONTEST_DETAILS);
        //   }
        // }
        logger.debug({
            benchMark: false,
            responseTime: `${Date.now() - startTime}`,
            message: `MatchResults Fetched took ${Date.now() - startTime} ms`,
        });
        // send response and perform in backgroud for caching
        if ((Array.isArray(matchResultRecord) && matchResultRecord.length)) {
            // if ((Array.isArray(matchResultRecord) && matchResultRecord.length) || (matchResultRecord && Object.keys(matchResultRecord).length)) {
            resolve({
                status: SUCCESS,
                message:FOUND_SUCCESS,
                data: {
                    Contests: matchResultRecord,
                },
            });
        }
        reject({
            status: NOT_FOUND,
            message: INVALID_CONTEST_ID,
        });
    } catch (error) {
        logger.error(error, { methodName: 'contestUuid', error, resourceType: 'Contest' });
        reject({
            status: INTERNAL_ERROR,
        });
    }
});