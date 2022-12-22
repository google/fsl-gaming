const chai = require('chai');
const chaiHttp = require('chai-http');

/* eslint-disable no-unused-vars */
const should = chai.should();

chai.use(chaiHttp);

const server = require('../index');

describe('Simulate Match using MatchUuid', () => {
  it('1.SimulateMatch Success', (done) => {
    chai
      .request(server)
      .post('}/simulator/api/simulateMatch')
      .send({
        'match_id':'a386b0ba-32e2-4e78-a0f5-9bd152e50413'
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.should.have.status(200);
        done();
      });
  });
});


describe('Simulate each ball of match', () => {
    it('2.SimulateBall Success', (done) => {
      chai
        .request(server)
        .post('}/simulator/api/simulteBall')
        .send({
          "matchUuid":"123asc",
          "onCreaseBatsman":"hh554",
          "offCreaseBatsman":"vdgdg",
          "currentBolwer":"vgfs123",
          "ball":"BOUNDARY",
          "onCreaseBatsmanOut":false,
          "isGoodBall":true,
          "ballCount":1,
          "OverCount":0
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.should.have.status(200);
          done();
        });
    });
  });