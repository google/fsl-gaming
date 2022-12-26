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

describe('createPlayersBulk', () => {
    it('1.createPlayersBulk Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/playersbulk')
            .send({
                teamUuid: 'fa489545-faca-4ffe-9259-0efc226794c7',
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});
describe('createPlayersBulk', () => {
    it('1.createPlayersBulk Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/playersbulk')
            .send({
                teamUuid: 'e5987b7c-e1ac-4e13-b6ba-74a25b0988fc',
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(421);
                done();
            });
    });
});

describe('createPlayers', () => {
    it('1.createUser Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/player')
            .send({
                teamUuid: 'bac5630d-2e22-4a34-8412-7b51a441107f',
                category: "Batsman"
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('getAllPlayers', () => {
    it('1.getAllPlayers Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/players')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('getPlayerbyID', () => {
    it('1.get Player by ID Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/player/cbb8c23f-234e-425c-a883-1c10a2590ce5')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('getPlayersbyTeamID', () => {
    it('1.get Players by Team ID Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/players/e3872bff-3539-4a99-9935-34be6fa68ee9')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('update Players', () => {
    it('1.Update Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/player/0d0e918a-bd36-4969-8404-31b29bab6374')
            .send({
                "playerName": "player-abc",
                "category": "Batsman"
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});
