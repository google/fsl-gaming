/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/leaderBoardBusinessLogic');


//Controller to get ContestLeaderBoard based on contestId
exports.getContestLeaderBoard = (req, res) => {
  businesslogic
    .getContestLeaderBoard(req.swagger.params.contest_id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

//Controller to get playerLeaderBoard based on Fantasy team
exports.getFLPlayerLeaderBoard = (req, res) => {
  businesslogic
    .getFLPlayerLeaderBoard(req.swagger.params)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};