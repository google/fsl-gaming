/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/LeaderBoardBusinessLogic');

//Controller to update Fantasy team points
exports.updateContestLeaderBoard = (req, res) => {
  businesslogic
    .updateContestLeaderBoard(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};
//Controller to update Player points 
exports.updateFLPlayerLeaderBoard = (req, res) => {
  businesslogic
    .updateFLPlayerLeaderBoard(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};


