const chai = require('chai');
const chaiHttp = require('chai-http');

/* eslint-disable no-unused-vars */
const should = chai.should();

chai.use(chaiHttp);

const server = require('../index');

describe('get ContestLeaderBoard',()=>{
    it('1.getContestLeaderBoard Success',(done)=>{
        chai
        .request(server)
        .get('/display-leaderboard/api/contest-leaderboard/e2908487-9eed-487f-85f1-ff1ad7a1c28e')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        res.should.have.status(200);
        done();
      });
    })
});

describe('get FLContestLeaderBoard',()=>{
    it('1.getContestLeaderBoard Success',(done)=>{
        chai
        .request(server)
        .get('/display-leaderboard/api/player-leaderboard/e2908487-9eed-487f-85f1-ff1ad7a1c28e/a070e290-b2b8-4b52-b51f-0e34925765f8')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        res.should.have.status(200);
        done();
      });
    })
});