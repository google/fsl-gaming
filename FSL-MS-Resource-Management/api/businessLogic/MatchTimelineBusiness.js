/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable max-len */

const MatchTimelineService = require('../service/MatchTimelineService');

exports.createMatchTimeline = params => MatchTimelineService.createMatchTimeline(params);

exports.getMatchTimelineByMatchID = params => MatchTimelineService.getMatchTimelineByMatchID(params);

exports.updateMatchTimeline = (id, params) => MatchTimelineService.updateMatchTimeline(id, params);
