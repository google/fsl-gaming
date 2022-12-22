/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const UserService = require('../service/UserService');

exports.benchMarkInsertUser = params => UserService.benchMarkInsertUser(params);

exports.createUser = params => UserService.createUser(params);

exports.getAllUsers = () => UserService.getAllUsers();

exports.getUserByID = params => UserService.getUserByID(params);

exports.updateUser = (id, params) => UserService.updateUser(id, params);
