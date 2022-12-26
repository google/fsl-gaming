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

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
/* eslint-disable max-len */
const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/PlayerLeaderBoardBusiness');

exports.createPlayerLeaderboardBulk = (req, res) => {
  businesslogic
    .createPlayerLeaderboardBulk(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.createPlayerLeaderboard = (req, res) => {
  businesslogic
    .createPlayerLeaderboard(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};


exports.getAllPlayerLeaderboard = (req, res) => {
  businesslogic
    .getAllPlayerLeaderboard()
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getPlayerLeaderboardByID = (req, res) => {
  businesslogic
    .getPlayerLeaderboardByID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getPlayerLeaderboardByPlayerID = (req, res) => {
  businesslogic
    .getPlayerLeaderboardByPlayerID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getPlayerLeaderboardByMatchID = (req, res) => {
  businesslogic
    .getPlayerLeaderboardByMatchID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.updatePlayerLeaderboardPoints = (req, res) => {
  businesslogic
    .updatePlayerLeaderboardPoints(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getPlayerLeaderboardScore = (req, res) => {
  businesslogic
    .getPlayerLeaderboardScore(req.swagger.params.playerUuid.value, req.swagger.params.matchUuid.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};
