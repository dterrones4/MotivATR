'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server.js');
const TEST_DATABASE_URL = require('../config');
const UserAccount = require('../models');

const should = chai.should;
const expect = chai.expect;

chai.use(chaiHttp);

function tearDownDb(){
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}
/*
describe('users endpoint', function (){

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  
  afterEach(function(){
      return tearDownDb();
  });

  after(function() {
    return closeServer();
  });
  describe('POST endpoint', function() {
    it('should add new user account', function(){
      const newUser = {
        username: 'username',
        email: 'email@gmail.com',
        phoneNumber: '8057177823',
        password: 'password24'
      }
      return chai.request(app)
      .post('/api/users')
      .send(newUser)
      .then(function(res){
        res.body.should.be.a('object');
        res.should.be.json;
        res.body.should.include.keys('username', 'email', 'phoneNumber');
        res.body.username.shoud.equal(newUser.username);
        res.body.email.shoud.equal(newUser.email);
        res.body.phoneNumber.shoud.equal(newUser.phoneNumber);
      })
    });
  });
});*/

describe('index page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  })
});