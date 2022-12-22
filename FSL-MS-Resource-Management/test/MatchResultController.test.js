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