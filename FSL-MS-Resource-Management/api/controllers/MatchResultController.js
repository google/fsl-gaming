const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/MatchResultBusiness');

exports.createMatchResult = (req, res) => {
  businesslogic
    .createMatchResult(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getMatchResultsByContestID = (req, res) => {
  businesslogic
    .getMatchResultsByContestID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};