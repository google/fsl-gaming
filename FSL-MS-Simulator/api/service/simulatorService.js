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
const logger = require("../../../FSL-Backend-Common/utils/logger");
const axios = require("axios").default;
const pubsubService = require('../../../FSL-Backend-Common/utils/pubsub')
const {
  INTERNAL_ERROR,
  SUCCESS,
  IN_PROGRESS
} = require("../../../FSL-Backend-Common/config/status-codes");
const { SAVE_SUCCESS, PUBLISHED_SUCCESS } = require("../../../FSL-Backend-Common/config/strings");
var SimulateInn = require("../../simulateInnings");
const { runSelect, mutateUpdate } = require('../../../FSL-Backend-Common/database/spanner');
const { URLS } = require("../../../FSL-Backend-Common/config/constants");
const {
  contestStatus,
} = require("../../../FSL-Backend-Common/config/constants");

/**
 * Function Name: simulateMatch
 * Description: Simulates a match for the give match Id
 * @param {match_id} params
 * @returns
 
 * Exceptions: Throws Exception on invalid match_id
 * -
 */
exports.simulateMatch = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const { match_id } = params;
      const status = contestStatus['in-progress']
      const match_status = await runSelect("SELECT matchStatus from MatchDetails WHERE matchUuid=@matchUuid", {
        matchUuid: match_id
      })
      // Chefck for Match is already started or not
      if (match_status.length > 0) {
        if (match_status[0].matchStatus == status) {
          reject({
            'status': IN_PROGRESS,
            'message': "Match already in progress!",
          });
        }
      }
      // Set Match Status as IN_PROGRESS 
      mutateUpdate('MatchDetails', {
        matchUuid: match_id,
        matchStatus: status,
      });

      // Get all contests for that match and set it as IN_PROGRESS
      const contestIds = await runSelect('SELECT contestUuid from ContestDetails WHERE matchUuid=@matchUuid', {
        'matchUuid': match_id,
      }).catch(error => {
        logger.error({ error })
        reject({
          'status': INTERNAL_ERROR,
          error
        })
      })

      contestIds.forEach(async (contestId) => {
        mutateUpdate("ContestDetails", {
          contestUuid: contestId.contestUuid,
          contestStatus: status,
        }).catch(error =>{
          reject(
            logger.error({error,methodName:"simulateMatch",resourceType:"simulator"})
          )
          
        });
      });

      // call /resource-management/api/createPlaying11
      // players and teams will be created here
      let res = await axios.post(
        `${URLS[process.env.NODE_ENV]["resource-management"]}/playing11`,
        {
          matchUuid: match_id,
        }
      ).catch(err => {
        logger.error({ 'error': err, 'message': err.message })
        reject({
          'status': INTERNAL_ERROR,
          'message': err.message,
          'error': err
        })
      });

      let players = res.data.data;

      let batting_first_team;
      let batting_second_team;

      let batting_first_team_squad = {
        'players': [],
        'bowlers': [],
      };

      let batting_second_team_squad = {
        'players': [],
        'bowlers': [],
      };

      // Conduct Toss
      let TOSS_OPTIONS = ["BAT", "BOWL"];

      let teams = ["team1", "team2"];

      const playToss = (teams) => {
        let winner = teams[Math.floor(Math.random() * teams.length)];
        let decision =
          TOSS_OPTIONS[Math.floor(Math.random() * TOSS_OPTIONS.length)];
        return {
          decision: decision,
          winner: winner,
        };
      };

      let teamsPlayerId = [];
      players["team1"].forEach((team) => {
        teamsPlayerId.push(team.playerUuid);
      });
      players["team2"].forEach((team) => {
        teamsPlayerId.push(team.playerUuid);
      });

      //Create Playing PlayerLeaderboard
      if (teamsPlayerId.length == 22) {
        teamsPlayerId.forEach((playerUuid) => {
          axios.post(
            `${URLS[process.env.NODE_ENV]["resource-management"]
            }/player-leaderboard`,
            {
              matchUuid: match_id,
              playerUuid: playerUuid,
            }
          );
        });
      } else {
        reject({
          status: INTERNAL_ERROR,
          'message': 'Playing players count missmatch!'
        });
      }

      toss = playToss(teams);

      // Create Teams for simulation
      teams.forEach((team) => {
        if (toss.winner == team) {
          if (toss.decision == "BAT") {
            batting_first_team = team;
          } else {
            batting_second_team = team;
          }
        } else {
          if (toss.decision == "BAT") {
            batting_second_team = team;
          } else {
            batting_first_team = team;
          }
        }
      });

      players[batting_first_team].forEach((player) => {
        if (
          player.category == "Wicket-Keeper" ||
          player.category == "Batsman"
        ) {
          batting_first_team_squad["players"].push(player.playerUuid);
        } else if (
          player.category == "Bowler" ||
          player.category == "All-Rounder"
        ) {
          batting_first_team_squad["players"].push(player.playerUuid);
          batting_first_team_squad["bowlers"].push({
            player: player.playerUuid,
            oversBowled: 0,
          });
        }
      });

      players[batting_second_team].forEach((player) => {
        if (
          player.category == "Wicket-Keeper" ||
          player.category == "Batsman"
        ) {
          batting_second_team_squad["players"].push(player.playerUuid);
        } else if (
          player.category == "Bowler" ||
          player.category == "All-Rounder"
        ) {
          batting_second_team_squad["players"].push(player.playerUuid);
          batting_second_team_squad["bowlers"].push({
            player: player.playerUuid,
            oversBowled: 0,
          });
        }
      });

      let innings1_batting = {};
      let innings1_bowling = {};
      let innings2_batting = {};
      let innings2_bowling = {};
      batting_first_team_squad.players.forEach((p) => {
        innings1_batting[p] = { score: 0, inAt: 0, isAvailable: true };
      });
      batting_second_team_squad.bowlers.forEach((p) => {
        innings1_bowling[p.player] = { name: p.player, oversBowled: 0 };
      });
      batting_second_team_squad.players.forEach((p) => {
        innings2_batting[p] = { score: 0, inAt: 0, isAvailable: true };
      });
      batting_first_team_squad.bowlers.forEach((p) => {
        innings2_bowling[p.player] = { name: p.player, oversBowled: 0 };
      });

      // Create Simulation object
      var SimulateInnings1 = new SimulateInn(
        innings1_batting,
        innings1_bowling,
        innings2_batting,
        innings2_bowling,
        match_id
      );

      // 10mins to start the simulation 
      // No teams can be created at this time
      // setTimeout(() => {
      // innings1 = SimulateInnings1.simulateInnings();
      // }, 10 * 1000)

      innings1 = SimulateInnings1.simulateInnings();

      resolve({
        status: SUCCESS,
        message: SAVE_SUCCESS,
        data: {
          'matchUuid': match_id,
          'contestStatus': status
        },
      });
    } catch (error) {
      logger.error(error, {
        methodName: "simulator",
        error,
        resourceType: "simulateMatch",
      });
      reject({
        status: INTERNAL_ERROR,
      });
    }
  });

/**
 * Function Name: simulteBall
 * Description: Simulates each ball of the match and publish Message in pubsub services.
 * @param { onCreaseBatsman,offCreaseBatsman,currentBolwer,ball,run,isGoodBall,ballCount,OverCount } params
 * @returns
 *
 * Exceptions: Throws Internal server error if any
 * -
 */
exports.simulteBall = (params) =>
  new Promise((resolve, reject) => {
    try {
      const {
        matchUuid,
        onCreaseBatsman,
        offCreaseBatsman,
        currentBolwer,
        ball,
        run,
        isGoodBall,
        ballCount,
        OverCount,
      } = params;
      let resObj = {};
      resObj["matchUuid"] = matchUuid;
      resObj["onCreaseBatsman"] = onCreaseBatsman;
      resObj["offCreaseBatsman"] = offCreaseBatsman;
      resObj["currentBolwer"] = currentBolwer;
      resObj["ball"] = ball;
      resObj["run"] = run;
      resObj["isGoodBall"] = isGoodBall;
      resObj["ballCount"] = ballCount;
      resObj["OverCount"] = OverCount;
      switch (ball) {
        case "EXTRA":
          resObj["extraType"] = run;
          break;
        case "WICKET":
          resObj["onCreaseBatsmanOut"] = params.onCreaseBatsmanOut;
          resObj["isWicketFallen"] = true;
          resObj["bowler"] = currentBolwer;
          resObj["wicketType"] = run;
          break;
        case "BOUNDARY":
          resObj["isBoundary"] = params.isBoundary;
          break;
        default:
          break;
      }
      resObj['topic'] = "simulatorScore"
      pubsubService.publishMessage(resObj);
      resolve({
        status: SUCCESS,
        message: PUBLISHED_SUCCESS,
        result: resObj
      })
    } catch (error) {
      reject({
        status: INTERNAL_ERROR,
        error
      });
    }
  });
