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
