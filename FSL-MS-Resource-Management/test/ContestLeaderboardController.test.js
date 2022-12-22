const chai = require('chai');
const chaiHttp = require('chai-http');

/* eslint-disable no-unused-vars */
const should = chai.should();

chai.use(chaiHttp);

const server = require('../index');

describe('Create Contest LeaderBoard ', () => {
  it('1.createContestLeaderBoard Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/contest-leaderboard')
      .send({
        playerUuid: "6ca69299-b9b1-4084-a2b7-3962d8bebc92",
        matchUuid: "c37a5f5a-8106-45f1-b518-447a93ac714d",
        fantasyTeamUuid: "8c430fac-0313-480a-991d-11f4c169e2b8",
        contestUuid: "3a579302-68c2-4e96-97d6-62cf4cc2bd11",
        isCaptain: false,
        isVCaptain: false
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('getContestLeaderboardByID', () => {
  it('1.get ContestLeaderboard details by contestLeaderUuid  Success', (done) => {
      chai
          .request(server)
          .get('/resource-management/api/contest-leaderboard/000050e0-1cb7-4add-8f31-e64827986045')
          .set('Accept', 'application/json')
          .end((err, res) => {
              res.body.should.be.a('object');
              res.should.have.status(200);
              done();
          });
  });
});


