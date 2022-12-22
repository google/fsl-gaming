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