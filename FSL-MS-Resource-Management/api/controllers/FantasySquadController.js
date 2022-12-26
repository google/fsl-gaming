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
const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/FantasySquadBusinnes');


exports.createFantasyTeamSquadDetails = (req, res) => {
  businesslogic
    .createFantasyTeamSquadDetails(req.body)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getFantasyTeamsSquadDetailsByFantasyTeamID = (req, res) => {
  businesslogic
    .getFantasyTeamsSquadDetailsByFantasyTeamID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.createFantasyTeamSquadDetailsBulk = (req, res) => {
  businesslogic
    .createFantasyTeamSquadDetailsBulk(req.body)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};
