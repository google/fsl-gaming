/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const SimulatorService = require('../service/simulatorService');

exports.simulateMatch = params => SimulatorService.simulateMatch(params);

exports.simulteBall = params => SimulatorService.simulteBall(params);
