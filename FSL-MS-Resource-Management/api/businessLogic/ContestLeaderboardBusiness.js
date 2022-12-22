/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable max-len */

const contestLeaderBoardService = require('../service/ContestLeaderboardService');

exports.createContestLeaderboard = params => contestLeaderBoardService.createContestLeaderboard(params);


exports.getAllContestLeaderboard = () => contestLeaderBoardService.getAllContestLeaderboard();

exports.getContestLeaderboardByID = params => contestLeaderBoardService.getContestLeaderboardByID(params);

exports.getContestLeaderboardByContestID = params => contestLeaderBoardService.getContestLeaderboardByContestID(params);

exports.winerListUpdation = params => contestLeaderBoardService.winerListUpdation(params);
