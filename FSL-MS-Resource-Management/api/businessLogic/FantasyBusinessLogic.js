/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable max-len */

const FantasyService = require('../service/FantasyService');

exports.createFantasyTeamDetails = params => FantasyService.createFantasyTeamDetails(params);

exports.getFantasyTeamsDetailsByID = params => FantasyService.getFantasyTeamsDetailsByID(params);

exports.getFantasyTeamsDetailsByUserID = params => FantasyService.getFantasyTeamsDetailsByUserID(params);

exports.getFantasyTeamsDetailsByContestID = params => FantasyService.getFantasyTeamsDetailsByContestID(params);
