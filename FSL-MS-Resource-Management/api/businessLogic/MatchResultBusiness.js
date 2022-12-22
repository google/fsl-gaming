/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */

const MatchResultService = require('../service/MatchResultService');

exports.createMatchResult = params => MatchResultService.createMatchResult(params);

exports.getMatchResultsByContestID = params => MatchResultService.getMatchResultsByContestID(params);

