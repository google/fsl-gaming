const chai = require('chai');
const chaiHttp = require('chai-http');

/* eslint-disable no-unused-vars */
const should = chai.should();

chai.use(chaiHttp);

const server = require('../index');

describe('Create User', () => {
  it('1.createUser Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/create/user')
      .send({
        mobileNumber: '6526237793'
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });
});
describe('Create User', () => {
  it('1.createUser Success', (done) => {
    chai
      .request(server)
      .post('/resource-management/api/user')
      .send({
        mobileNumber: '6926237793'
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(405);
        done();
      });
  });
});


describe('getUserByID', () => {
  it('1.get User By ID Success', (done) => {
    chai
      .request(server)
      .get('/resource-management/api/user/0000165c-cdd3-4976-a22d-4a28993351c7')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(200);
        done();
      });
  });
});

describe('getUserByID', () => {
  it('1.get User By ID Failure', (done) => {
    chai
      .request(server)
      .get('/resource-management/api/user/0000165c-cdd3-4976-a22d-4a2899335')
      .set('Accept', 'application/json')
      .end((err, res) => {
        res.body.should.be.a('object');
        res.should.have.status(421);
        done();
      });
  });
});