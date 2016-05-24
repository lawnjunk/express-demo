'use strict';
const uuid = require('node-uuid');
const AppError = require('../lib/app-error');

const List = module.exports = function(name){
  if (!name){
    throw AppError.error400('list constructor requires name');
  }
  this.id = uuid.v4();
  this.name = name;
  this.noteIDs = [];
};

List.prototype.addNoteID = function(id){
  this.noteIDs.push(id);
};

List.prototype.removeNoteID = function(id){
  this.noteIDs = this.noteIDs.filter(function(value){
    if (value === id) return false;
    return true;
  });
};
