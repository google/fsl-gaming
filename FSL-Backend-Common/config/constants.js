// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// TODO: High-level file comment.

exports.MAX_MUTATION = 40000
exports.SECONDARY_INDEXES = {
    "ContestDetails":1,
    "ContestLeaderboard":2,
    "FantasyTeamDetails":1,
    "FantasyTeamSquadDetails":0,
    "MatchDetails":0,
    "MatchResults":0,
    "MatchTimeline":0,
    "PlayerDetails":0,
    "PlayerLeaderboard":0,
    "TeamDetails":0,
    "UserDetails":0,
}

exports.role = 'USER'
exports.matchStatus = {
    "scheduled": "SCHEDULED",
    "active": "ACTIVE",
    "completed": "COMPLETED",
}
exports.teamSize = [14, 15, 16]
exports.contestStatus = {
    "scheduled": "SCHEDULED",
    "in-progress": "IN-PROGRESS",
    "completed": "COMPLETED",
}
exports.playersCount = { Batsman: 5, Bowler: 5, 'All-Rounder': 3 }
exports.slotSize = { min: 50000, max: 1000000 };
exports.RUN_BUCKET = {
    "POWERPLAY_BUCKET": ['RUN', 'RUN', 'RUN', 'WICKET', 'RUN', 'RUN', 'BOUNDARY', 'BOUNDARY', 'RUN', 'RUN', 'EXTRA', 'EXTRA', 'WICKET'],
    "NON_POWERPLAY_BUCKET": ['RUN', 'RUN', 'RUN', 'WICKET', 'RUN', 'RUN', 'BOUNDARY', 'EXTRA', 'RUN', 'RUN', 'EXTRA', 'WICKET', 'WICKET'],
    "WICKET_BUCKET": ['BOWLED', 'BOWLED', 'CAUGHT', 'CAUGHT', 'CAUGHT', 'RUNOUT', 'STUMPED', 'LBW', 'LBW'],
    "EXTRA_BUCKET": ['WD', 'WD', 'WD', 'NB', 'NB'],
    "RUN_BUCKET": [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3],
    "BOUNDARY_BUCKET": [4, 4, 4, 4, 4, 4, 4, 6, 6, 6]
}
exports.TOTAL_OVER_COUNT = 20
exports.BOWLER_OVER_COUNT = 4
exports.POWERPLAY_OVER_COUNT = 6
exports.TOTAL_WICKET_COUNT = 10

role = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper']
exports.slotSize = { min: 50000, max: 1000000 }

exports.configValues = ['5', '6', '7', '8', '9', '10']
exports.pointsSize = ['5', '6', '7', '8', '9', '10']
exports.points = 0

exports.URLS = {
    development: {
        'resource-management': 'http://localhost:5007/resource-management/api',
        'update-leaderboard': 'http://localhost:5009/update-leaderboard/api',
        'display-leaderboard': 'http://localhost:5004/display-leaderboard/api',
        'simulator': 'http://localhost:5008/simulator/api',
    },
    uat: {
        'resource-management': 'https://fsl.danielnwang.demo.altostrat.com/resource-management/api',
        'update-leaderboard': 'https://fsl.danielnwang.demo.altostrat.com/update-leaderboard/api',
        'display-leaderboard': 'https://fsl.danielnwang.demo.altostrat.com/display-leaderboard/api',
        'simulator': 'https://fsl.danielnwang.demo.altostrat.com/simulator/api',
    },
}
exports.REDIS_BUCKET = {
    USER_DETAILS: 'UserDetails',
    TEAM_DETAILS: 'TeamDetails',
    MATCH_DETAILS: 'MatchDetails',
    PLAYER_DETAILS: 'PlayerDetails',
    CONTEST_DETAILS: 'ContestDetails',
    FANTASY_TEAM_DETAILS: 'FantasyTeamDetails',
    FANTASY_SQUAD_SERVICE: 'FantasySquadServiceDetails',
    CONTEST_LEADERBOARD: 'ContestLeaderboardDetais',
    MATCH_TIMELINE: 'MatchTimelineDetails',
}