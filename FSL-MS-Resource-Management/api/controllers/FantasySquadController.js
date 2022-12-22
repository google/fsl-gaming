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
