'use strict';

const uuid = require('node-uuid');
const AppError = require('../lib/app-error');

module.exports = function(content, authorID){
  if (!content || !authorID){
    throw AppError.error400('Note constructor requires contetn and authorID');
  }
  this.id = uuid.v1();
  this.authorID = authorID;
  this.content = content;
  this.timestamp = new Date();
};
