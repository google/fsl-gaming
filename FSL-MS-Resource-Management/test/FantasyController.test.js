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

describe('Create Fantasy Team Details', () => {
  it('1.createFantasyTeam Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/fantasy-team-details')
      .send({
        userUuid: '0000165c-cdd3-4976-a22d-4a28993351c7',
        contestUuid: '38d88947-99ab-44d3-a506-e1301eee070e',
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });
});



describe('getFantasyTeamsDetailsByID', () => {
  it('1.get FantasyTeams details by Fantasy Team id  Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/fantasy-team-details/1b39a458-85b0-41b6-bf2c-33e8b78fa2b8')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});


describe('getFantasyTeamsDetailsByUserID', () => {
  it('1.get FantasyTeams Details by UserID  Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/fantasy-team-details-userID/0000165c-cdd3-4976-a22d-4a28993351c7')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});

describe('getFantasyTeamsDetailsByContestID', () => {
  it('1.get FantasyTeam Details by ContestID  Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/fantasy-team-details-contestID/38d88947-99ab-44d3-a506-e1301eee070e')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});