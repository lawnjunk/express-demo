'use strict';

const uuid = require('node-uuid');
const debug = require('debug')('user');
const AppError = require('../lib/app-error');

module.exports = function(username, email){
  debug('Enter User constructor');
  if (!username || !email){
    throw new AppError('User model requires username and email', 400, 'bad request');
  }
  this.id = uuid.v4();
  this.username = username;
  this.email = email;
};
