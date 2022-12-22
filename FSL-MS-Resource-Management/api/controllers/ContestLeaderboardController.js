const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/ContestLeaderboardBusiness');

exports.createContestLeaderboard = (req, res) => {
  businesslogic
    .createContestLeaderboard(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};


exports.getAllContestLeaderboard = (req, res) => {
  businesslogic
    .getAllContestLeaderboard()
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getContestLeaderboardByID = (req, res) => {
  businesslogic
    .getContestLeaderboardByID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getContestLeaderboardByContestID = (req, res) => {
  businesslogic
    .getContestLeaderboardByContestID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};
