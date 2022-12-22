/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */

const ContestService = require('../service/ContestService');

exports.createContest = params => ContestService.createContest(params);

exports.createPlaying11 = params => ContestService.createPlaying11(params);

exports.updateWinnersList = params => ContestService.updateWinnersList(params);

exports.getAllContests = () => ContestService.getAllContests();

exports.getContestbyID = params => ContestService.getContestbyID(params);

exports.getContestsByMatchID = params => ContestService.getContestsByMatchID(params);

exports.updateContest = (id, params) => ContestService.updateContest(id, params);

exports.getContestsByActiveStatus = () => ContestService.getContestsByActiveStatus();

exports.getContestsByScheduledStatus = () => ContestService.getContestsByScheduledStatus();

exports.getContestsByCompletedStatus = () => ContestService.getContestsByCompletedStatus();

exports.getContestResultbyID = params => ContestService.getContestResultbyID(params);
