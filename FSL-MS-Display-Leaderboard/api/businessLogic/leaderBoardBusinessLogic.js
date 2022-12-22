/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const LeaderBoardService = require('../service/leaderBoardService');

//calls getContestLeaderBoard service 
exports.getContestLeaderBoard = params => LeaderBoardService.getContestLeaderBoard(params);

//calls getFLPlayerLeaderBoard service 
exports.getFLPlayerLeaderBoard = params => LeaderBoardService.getFLPlayerLeaderBoard(params);


