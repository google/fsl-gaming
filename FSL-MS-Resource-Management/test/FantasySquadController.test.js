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

describe('createFantasyTeamSquadDetails', () => {
  it('1.createFantasySquad Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/fantasy-team-squad-details')
      .send({
        fantasyTeamUuid: 'e6eb9044-5915-4bf2-a5db-17bf684c5bfd',
        playerUuid:'cbb8c23f-234e-425c-a883-1c10a2590ce5',
        isCaptain: true,
        isVCaptain: false,
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });
});

describe('Create Fantasy squad Bulk ', () => {
    it('1.createFantasySquadBuk Success', (done) => {
      chai
        .request(server)
        .post('/resource-management/api/fantasy-team-squad-details-bulk')
        .send({
          fantasyTeamUuid: 'cafb6905-90ef-4f00-8081-425dc5fb1c00',
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(200);
          done();
        });
    });
  });

  
  describe('getFantasyTeamsSquadDetailsByFantasyTeamID', () => {
    it('1.get FantasyTeamSquad  Details by FantasyTeamID  Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/fantasy-team-squad-details/cafb6905-90ef-4f00-8081-425dc5fb1c00')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
  });
