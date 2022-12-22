/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
/* eslint-disable max-len */

const utils = require('../../../FSL-Backend-Common/utils/writer');
const businesslogic = require('../businessLogic/UserBusinessLogic');

exports.benchMarkInsertUser = (req, res) => {
  businesslogic
    .benchMarkInsertUser(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.createUser = (req, res) => {
  businesslogic
    .createUser(req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getAllUsers = (req, res) => {
  businesslogic
    .getAllUsers()
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.getUserByID = (req, res) => {
  businesslogic
    .getUserByID(req.swagger.params.id.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};

exports.updateUser = (req, res) => {
  businesslogic
    .updateUser(req.swagger.params.id.value, req.swagger.params.body.value)
    .then((response) => {
      utils.writeJson(res, response, response.status);
    })
    .catch((error) => {
      utils.writeJson(res, error, error.status);
    });
};
