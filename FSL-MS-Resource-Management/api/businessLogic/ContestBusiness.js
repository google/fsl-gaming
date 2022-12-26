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

/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */

const ContestService = require('../service/ContestService');

exports.createContest = params => ContestService.createContest(params);

exports.createPlaying11 = params => ContestService.createPlaying11(params);

exports.updateWinnersList = params => ContestService.updateWinnersList(params);

exports.getAllContests = () => ContestService.getAllContests();

exports.getContestbyID = params => ContestService.getContestbyID(params);

exports.getContestsByMatchID = params => ContestService.getContestsByMatchID(params);

exports.updateContest = (id, params) => ContestService.updateContest(id, params);

exports.getContestsByActiveStatus = () => ContestService.getContestsByActiveStatus();

exports.getContestsByScheduledStatus = () => ContestService.getContestsByScheduledStatus();

exports.getContestsByCompletedStatus = () => ContestService.getContestsByCompletedStatus();

exports.getContestResultbyID = params => ContestService.getContestResultbyID(params);
