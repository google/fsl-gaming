const businesslogic = require('../businessLogic/RedisBusiness');
const utils = require('../../../FSL-Backend-Common/utils/writer');
exports.clearRedis = (req, res) => {
    businesslogic
      .clearRedis()
      .then((response) => {
        utils.writeJson(res, response, response.status);
      })
      .catch((error) => {
        utils.writeJson(res, error, error.status);
      });
  };