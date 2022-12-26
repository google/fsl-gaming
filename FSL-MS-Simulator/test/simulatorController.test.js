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

describe('Simulate Match using MatchUuid', () => {
  it('1.SimulateMatch Success', (done) => {
    chai
      .request(server)
      .post('}/simulator/api/simulateMatch')
      .send({
        'match_id':'a386b0ba-32e2-4e78-a0f5-9bd152e50413'
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.should.have.status(200);
        done();
      });
  });
});


describe('Simulate each ball of match', () => {
    it('2.SimulateBall Success', (done) => {
      chai
        .request(server)
        .post('}/simulator/api/simulteBall')
        .send({
          "matchUuid":"123asc",
          "onCreaseBatsman":"hh554",
          "offCreaseBatsman":"vdgdg",
          "currentBolwer":"vgfs123",
          "ball":"BOUNDARY",
          "onCreaseBatsmanOut":false,
          "isGoodBall":true,
          "ballCount":1,
          "OverCount":0
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.should.have.status(200);
          done();
        });
    });
  });