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
