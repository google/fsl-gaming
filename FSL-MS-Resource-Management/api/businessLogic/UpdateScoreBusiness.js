/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const UpdateScoreService = require('../service/UpdateScoreService');

exports.updateScore = params => UpdateScoreService.updateScore(params);
