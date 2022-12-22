/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable max-len */

const MatchService = require('../service/MatchService');

exports.createMatchAuto = () => MatchService.createMatchAuto();

exports.createMatch = params => MatchService.createMatch(params);

exports.getMatchByID = params => MatchService.getMatchByID(params);

exports.getAllMatch = () => MatchService.getAllMatch();

exports.getMatchesByTeamID = params => MatchService.getMatchesByTeamID(params);

exports.updateMatch = (id, params) => MatchService.updateMatch(id, params);
