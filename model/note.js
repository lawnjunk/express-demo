'use strict';

const uuid = require('node-uuid');

module.exports = function(content, authorID){
  if (!content || !authorID){
    throw new Error('Note\'s require content and authorID');
  }
  this.id = uuid.v1();
  this.authorID = authorID;
  this.content = content;
  this.timestamp = new Date();
};
