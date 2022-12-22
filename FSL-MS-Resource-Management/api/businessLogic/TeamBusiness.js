/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const TeamService = require('../service/TeamService');

exports.createTeam = () => TeamService.createTeam();

exports.getTeambyID = params => TeamService.getTeambyID(params);

exports.getAllTeams = () => TeamService.getAllTeams();

exports.updateTeam = (id, params) => TeamService.updateTeam(id, params);
