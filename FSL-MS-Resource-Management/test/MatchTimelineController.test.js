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

describe('Create Match Timeline ', () => {
  it('1.createMatchTimeline Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/match-timeline')
      .send({
        matchUuid: '4018fe0b-6ae4-4485-933a-89402d057478',
        batsmanUuid: "0f40d7ca-b3a4-4d3a-91f5-faf30e567fbe",
        bowlerUuid: "030e63fc-6623-44c1-8adb-e97dfb9016b4",
       over_count: 2,
       ball_count: 3,
        score: 5,
         hasLostWicket: false,
        batsmanOutUuid: "string",
        wicketType: "string",
        hasExtra: false,
       extraType: "string"
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });
});



describe('getMatchTimelineByMatchID', () => {
  it('1.get MatchTimeline By MatchID Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/match-timeline/4018fe0b-6ae4-4485-933a-89402d057478')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});

describe('updateMatchTimeline', () => {
  it('1.update MatchTimeline By matchTimeline Id Success', (done) => {
      chai
          .request(server)
          .patch('/resource-management/api/match-timeline/0093f289-32f6-4cfc-b56a-7145e007096e')
          .send({
            over_count:4,
             ball_count:5, 
             score:36,
             hasLostWicket:false,
              hasExtra:false
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