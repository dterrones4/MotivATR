'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {UserAccount} = require('../models');
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL, PORT} = require('../config');

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

function seedUserData() {
  console.info('seeding user data');
  const seedData = [];

  for (let i = 1; i <= 10; i++) {
    seedData.push({
      email: faker.internet.email(),
      phoneNumber: faker.phone.phoneNumber(),
      password: faker.internet.password()
    });
  }
  // this will return a promise
  return UserAccount.insertMany(seedData);
}


describe('users API resource', function (){

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    return seedUserData();
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
        email: 'email@gmail.com',
        phoneNumber: '8057177823',
        password: 'password24'
      };

      return chai.request(app)
      .post('/api/users')
      .send(newUser)
      .then(function(res){
        //res.body.should.be.a('object');
        res.should.be.json;
        //res.body.should.include.keys('email', 'phoneNumber');
        //res.body.email.shoud.equal(newUser.email);
        //res.body.phoneNumber.shoud.equal(newUser.phoneNumber);
      });
    });
  });
});

describe('index page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  })
});