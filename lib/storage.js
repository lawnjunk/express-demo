'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const co = require('co');
const AppError = require('./app-error');
const debug = require('debug')('STORAGE');

const Storage = module.exports = function(rootDir){
  if (!rootDir) throw new Error('storage module requires rootDir');
  this.rootDir = rootDir;
  mkdirp(this.rootDir, function(err){
    if (err) {
      console.error(err);
      err = new AppError(`Storage could not make rootDir: ${this.rootDir}`, 500, 'internal server error');
      throw err;
    }
  });
};

Storage.prototype.typeDirExists = function(type){
  return new Promise((resolve, reject) => {
    fs.stat(`${this.rootDir}/${type}`, (err) => {
      if (err) {
        debug(err);
        err = new AppError(`Storage type: ${type} not found`, 404, 'not found');
        return reject(err);
      }
      resolve();
    });
  });
};


Storage.prototype.assertTypeDir = function(type){
  return new Promise((resolve, reject) => {
    co((function*(){
      yield this.typeDirExists(type);
      resolve();
    }).bind(this)).catch(() => {
      co((function*(){
        yield this.mkTypeDir(type);
        resolve();
      }).bind(this)).catch((err) => {
        console.error(err);
        err = new AppError(`Storage unable to create type dir: ${type} `, 500, 'internal server error');
        reject(err);
      });
    });
  });
};

Storage.prototype.mkTypeDir = function(type){
  return new Promise((resolve, reject) => {
    fs.mkdirp(`${this.rootDir}/${type}`, function(err){
      if (err) {
        debug(err);
        err = new AppError('could note make type dir', 500, 'internal server error');
        return reject(err);
      }
      resolve();
    });
  });
};

Storage.prototype.deleteItemFile = function(type, id){
  return new Promise((resolve, reject) => {
    const filepath = `${this.rootDir}/${type}/${id}`;
    fs.unlink(filepath, function(err){
      if (err) {
        debug(err);
        err = new AppError(`item file not found: ${filepath}`, 404, 'not found');
        return reject(err);
      }
      resolve();
    });
  });
};

Storage.prototype.readItemFile = function(type, id){
  return new Promise((resolve, reject) => {
    const filepath = `${this.rootDir}/${type}/${id}`;
    fs.readFile(filepath, function(err, data){
      if (err) {
        debug(err);
        err = new AppError(`item file not found: ${filepath}`, 404, 'not found');
        return reject(err);
      }

      try {
        const item = JSON.parse(data);
        resolve(item);
      } catch (err){
        debug(err);
        reject(new AppError(`could not parse item file: ${filepath}`, 500, 'internal server error'));
      }
    });
  });
};

Storage.prototype.writeItemFile = function(type, item){
  return new Promise((resolve, reject) => {
    const filepath = `${this.rootDir}/${type}/${item.id}`;
    fs.writeFile(filepath, JSON.stringify(item), (err) => {
      if (err) {
        debug(err);
        err = new AppError(`could not write item file:${filepath}`, 500, 'internal server error');
        return reject(err);
      }
      resolve(item);
    });
  });
};

Storage.prototype.setItem = function(type, item){
  return new Promise((resolve, reject) => {
    co((function* () {
      yield this.assertTypeDir(type);
      yield this.writeItemFile(type, item);
      resolve(item);
    }).bind(this)).catch((err) => {
      reject(err);
    });
  });
};

Storage.prototype.fetchItem = function(type, id){
  return new Promise((resolve, reject) => {
    co((function*(){
      yield this.typeDirExists(type);
      var item = yield this.readItemFile(type, id);
      resolve(item);
    }).bind(this)).catch((err) => {
      reject(err);
    });
  });
};

Storage.prototype.deleteItem = function(type, id){
  return new Promise((resolve, reject) => {
    co((function*(){
      yield this.typeDirExists(type);
      yield this.deleteItemFile(type, id);
      resolve();
    }).bind(this)).catch((err) => {
      reject(err);
    });
  });
};
