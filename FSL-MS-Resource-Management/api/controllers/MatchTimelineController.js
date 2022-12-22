/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/MatchTimelineBusiness');


exports.createMatchTimeline = (req, res) => {
  businesslogic
    .createMatchTimeline(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};


exports.getMatchTimelineByMatchID = (req, res) => {
  businesslogic
    .getMatchTimelineByMatchID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};
exports.updateMatchTimeline = (req, res) => {
  businesslogic
    .updateMatchTimeline(req.swagger.params.id.value, req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};
