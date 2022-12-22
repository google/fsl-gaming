/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable max-len */

const playerLeaderBoardBusinessService = require('../service/PlayerLeaderBoardService');

exports.createPlayerLeaderboardBulk = params => playerLeaderBoardBusinessService.createPlayerLeaderboardBulk(params);

exports.createPlayerLeaderboard = params => playerLeaderBoardBusinessService.createPlayerLeaderboard(params);

exports.getAllPlayerLeaderboard = () => playerLeaderBoardBusinessService.getAllPlayerLeaderboard();

exports.getPlayerLeaderboardByID = params => playerLeaderBoardBusinessService.getPlayerLeaderboardByID(params);

exports.getPlayerLeaderboardByPlayerID = params => playerLeaderBoardBusinessService.getPlayerLeaderboardByPlayerID(params);

exports.getPlayerLeaderboardByMatchID = params => playerLeaderBoardBusinessService.getPlayerLeaderboardByMatchID(params);

exports.updatePlayerLeaderboardPoints = params => playerLeaderBoardBusinessService.updatePlayerLeaderboardPoints(params);

exports.getPlayerLeaderboardScore = (playerUuid, matchUuid) => playerLeaderBoardBusinessService.getPlayerLeaderboardScore(playerUuid, matchUuid);
