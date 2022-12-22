const chai = require('chai');
const chaiHttp = require('chai-http');

/* eslint-disable no-unused-vars */
const should = chai.should();

chai.use(chaiHttp);

const server = require('../index');

describe('Create PlayerLeaderboard  ', () => {
  it('1.createPlayerLeaderboard Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/player-leaderboard')
      .send({
        playerUuid:'0f40d7ca-b3a4-4d3a-91f5-faf30e567fbe', 
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

describe('Create PlayerLeaderboard Bulk ', () => {
    it('1.createPlayerLeaderboardBulk Success', (done) => {
      chai
        .request(server)
        .post('/resource-management/api/player-leaderboard-bulk')
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

  describe('getPlayerLeaderboardByID', () => {
    it('1.get PlayerLeaderboard By PlayerLeaderboardID Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/player-leaderboard/09c8c340-ff35-48dd-a9dd-d5e85b1d08b4')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
  });

  describe('getPlayerLeaderboardByPlayerID', () => {
    it('1.get PlayerLeaderboard By PlayerID Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/player-leaderboard-by-playerID/0f40d7ca-b3a4-4d3a-91f5-faf30e567fbe')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
  });

  describe('getPlayerLeaderboardByMatchID', () => {
    it('1.get PlayerLeaderboard By MatchID Success', (done) => {
        chai
            .request(server)
            .get('/resource-management/api/player-leaderboard-by-matchID/4018fe0b-6ae4-4485-933a-89402d057478')
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
  });


  describe('updatePlayerLeaderboardPoints', () => {
    it('1.update PlayerLeaderboard Points By Player Id  and Match Id Success', (done) => {
        chai
            .request(server)
            .patch('/resource-management/api/player-leaderboard-points')
            .send({
              playerUuid:"5e69a0f0-2758-4d1c-85b4-6392fbe6c671",
               matchUuid: 'a40ef961-ff74-4ffb-893d-3b31787fb9d9', 
               points:10
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                done();
            });
    });
  }); 