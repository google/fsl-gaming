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