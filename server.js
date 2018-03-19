'use strict';

const http = require('http');
const path = require('path');
const methods = require('methods');
const bodyParser = require('body-parser');
const passport = require('passport');
const errorhandler = require('errorhandler');
const session = require('express-session');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config/index');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + 'public'));
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

require('./models');
require('./config/passport');
app.use(require('./routes'));

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

//this function connect to our db, then starts the server
function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }
  

function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports =  {runServer, app, closeServer};