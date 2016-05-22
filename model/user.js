'use strict';

const uuid = require('node-uuid');
const debug = require('debug')('user');

module.exports = function(username, email){
  debug('Enter User constructor');
  if (!username || !email){
    throw new Error('User model requires username and email');
  }
  this.id = uuid.v4();
  this.username = username;
  this.email = email;
};
