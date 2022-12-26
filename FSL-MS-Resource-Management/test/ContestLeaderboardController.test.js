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

const chai = require('chai');
const chaiHttp = require('chai-http');

/* eslint-disable no-unused-vars */
const should = chai.should();

chai.use(chaiHttp);

const server = require('../index');

describe('Create Contest LeaderBoard ', () => {
  it('1.createContestLeaderBoard Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/contest-leaderboard')
      .send({
        playerUuid: "6ca69299-b9b1-4084-a2b7-3962d8bebc92",
        matchUuid: "c37a5f5a-8106-45f1-b518-447a93ac714d",
        fantasyTeamUuid: "8c430fac-0313-480a-991d-11f4c169e2b8",
        contestUuid: "3a579302-68c2-4e96-97d6-62cf4cc2bd11",
        isCaptain: false,
        isVCaptain: false
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('getContestLeaderboardByID', () => {
  it('1.get ContestLeaderboard details by contestLeaderUuid  Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/contest-leaderboard/000050e0-1cb7-4add-8f31-e64827986045')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});


