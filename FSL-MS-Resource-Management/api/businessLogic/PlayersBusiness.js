/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */

const PlayersService = require('../service/PlayersService');

exports.createPlayersBulk = params => PlayersService.createPlayersBulk(params);

exports.createPlayers = params => PlayersService.createPlayers(params);

exports.getPlayerbyID = params => PlayersService.getPlayerbyID(params);

exports.getPlayersbyTeamID = params => PlayersService.getPlayersbyTeamID(params);

exports.getAllPlayers = () => PlayersService.getAllPlayers();

exports.updatePlayer = (id, params) => PlayersService.updatePlayer(id, params);
