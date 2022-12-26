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

describe('Create Contest ', () => {
  it('1.createContest Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/contest')
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

describe('geContestbyID', () => {
  it('1.get Contest details by Contest Id Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/contest/38d88947-99ab-44d3-a506-e1301eee070e')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});

describe('geContestbyMatchID', () => {
  it('1.get Contest details by Match Id Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/contests/matches/4018fe0b-6ae4-4485-933a-89402d057478')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});

describe('updateContest', () => {
  it('1.update Contest Details By Contest Id Success', (done) => {
      chai
          .request(server)
          .patch('/resource-management/api/contests/38d88947-99ab-44d3-a506-e1301eee070e')
          .send({
            slot: 10000,
            contestStatus: "SCHEDULED",
          })
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.should.have.property('message');
              res.body.should.have.property('data');
              res.should.have.status(200);
              done();
          });
  });
});

describe('updateWinnersList', () => {
  it('1.update WinnerList By Contest Id Success', (done) => {
      chai
          .request(server)
          .post('/resource-management/api/winnerslist')
          .send({
            contestId: "38d88947-99ab-44d3-a506-e1301eee070e",
            results: [
              {
                score: 1,
                value: "string"
              }
            ]
          })
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.should.have.status(200);
              done();
          });
  });
});

describe('geContestby active status', () => {
  it('1.get Contest details by active status', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/contest/active-status')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});
describe('geContestby scheduled status', () => {
  it('1.get Contest details by active status', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/contest/scheduled-status')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});

describe('geContestby completed status', () => {
  it('1.get Contest details by active status', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/contest/completed-status')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});