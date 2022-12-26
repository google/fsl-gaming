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

describe('createTeam', () => {
    it('1.createUser Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/team')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('getAllTeams', () => {
    it('1.get All Teams Success', (done) => {
        chai
            .request(server)
            .post('/resource-management/api/teams')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('getTeambyID', () => {
    it('1.createUser Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/team/07fb056a-d910-442e-bda6-994b2f873152')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});

describe('updateTeam', () => {
    it('1.createUser Success', (done) => {
        chai
            .request(server)
            .patch('/resource-management/api/teams/e3872bff-3539-4a99-9935-34be6fa68ee9')
            .send({
                teamName: "Bangalore",
                availablePlayers: 16,
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
});