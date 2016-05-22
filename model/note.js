'use strict';

const uuid = require('node-uuid');
const AppError = require('../lib/app-error');

module.exports = function(content, authorID){
  if (!content || !authorID){
    throw new AppError('Note\'s require content and authorID', 400, 'bad request');
  }
  this.id = uuid.v1();
  this.authorID = authorID;
  this.content = content;
  this.timestamp = new Date();
};
