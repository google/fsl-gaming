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

describe('createMatchAuto', () => {
    it('1.createUser Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/match-auto')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('createMatch', () => {
    it('1.createMatch Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/match')
            .send({
                team1Uuid: 'e3872bff-3539-4a99-9935-34be6fa68ee9',
                team2Uuid: '1294238c-fa57-4a3f-a823-df461fdefa65'
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

describe('getMatchByID', () => {
    it('1.get Match By ID Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/match/4018fe0b-6ae4-4485-933a-89402d057478')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('getAllMatch', () => {
    it('1.get All Match Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/all-Match')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('getMatchesByTeamID', () => {
    it('1.createUser Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/matches/e3872bff-3539-4a99-9935-34be6fa68ee9')
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


describe('updateMatch', () => {
    it('1.createMatch Success', (done) => {
        chai
            .request(server)
            .patch('/resource-management/api/match/53d69526-bd33-475d-b26b-c6ca64666d58')
            .send({
                
                    matchTime: "2022-12-07T05:43:24.697Z",
                    matchStatus: "SCHEDULED"
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