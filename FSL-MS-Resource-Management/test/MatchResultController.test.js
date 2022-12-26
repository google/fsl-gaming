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

describe('Create Match Result ', () => {
  it('1.createMatchResult Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/match-result')
      .send({
        matchUuid: '4018fe0b-6ae4-4485-933a-89402d057478',
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });
});


describe('getMatchResultsByContestID', () => {
  it('1.get MatchResults By ContestID  Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/match-results/38d88947-99ab-44d3-a506-e1301eee070e')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});