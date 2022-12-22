/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const LeaderBoardService = require('../service/LeaderBoardService');


exports.updateContestLeaderBoard = params => LeaderBoardService.updateContestLeaderBoard(params);

exports.updateFLPlayerLeaderBoard = params => LeaderBoardService.updateFLPlayerLeaderBoard(params);



