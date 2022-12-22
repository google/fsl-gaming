/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable max-len */

const FantasySquadService = require('../service/FantasySquadService');

exports.createFantasyTeamSquadDetails = params => FantasySquadService.createFantasyTeamSquadDetails(params);

exports.getFantasyTeamsSquadDetailsByFantasyTeamID = params => FantasySquadService.getFantasyTeamsSquadDetailsByFantasyTeamID(params);

exports.createFantasyTeamSquadDetailsBulk = params => FantasySquadService.createFantasyTeamSquadDetailsBulk(params);
