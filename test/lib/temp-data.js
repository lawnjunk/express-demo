'use strict';

const fs = require('fs');
const co = require('co');
const List = require('../../model/list');
const Type = require('../../model/note');

exports.tempnote = new Type('test content', '123');
exports.templist = new List('todo');

exports.tempTypeFilePath = function(storagedir, type){
  return `${storagedir}/${type}/` +  this[`temp${type}`].id;
}

exports.tempTypeDirPath = function(storagedir, type){
  return `${storagedir}/${type}`;
}

exports.tempTypeDirExist = function(storagedir, type){
  return new Promise((resolve, reject) => {
    const dirPath = this.tempTypeDirPath(storagedir, type);
    fs.stat(dirPath, (err, stats) => {
      if (err) return reject(err);
      console.log('dir exists');
      resolve();
    });
  });
}

exports.mkTempTypeDir = function(storagedir, type){
  return new Promise((resolve, reject) => {
    co((function* (){
      yield this.tempTypeDirExist(storagedir, type);
      resolve();
      console.log('made dir');
    }).bind(this)).catch((err) => {
      const dirPath = this.tempTypeDirPath(storagedir, type);
      fs.mkdir(dirPath , (err) => {
        if (err) return reject(err);
        console.log('made dir');
        resolve();
      });
    });
  });
};

exports.tempTypeFileExist = function(storagedir, type){
  return new Promise((resolve, reject) => {
    const filepath = this.tempTypeFilePath(storagedir, type);
    fs.stat(filepath, (err, stats) => {
      if (err) return reject(err);
      console.log('file exits');
      resolve();
    });
  });
}

exports.mkTempTypeFile = function(storagedir, type){
  return new Promise((resolve, reject) => {
    console.log('this.tempType', this.tempType);
    co((function *(){
      yield this.tempTypeFileExist(storagedir, type);
      resolve();
    }).bind(this)).catch((err) => {
      co((function* (){
        yield this.mkTempTypeDir(storagedir, type);
        const filepath = this.tempTypeFilePath(storagedir, type);
        const data = JSON.stringify(this[`temp${type}`]);
        fs.writeFile(filepath, data, function(err){
          if (err) return reject(err);
          resolve();
          console.log('made file');
        });
      }).bind(this)).catch((err) => {
        reject(err);
      })
    });;
  });
};

exports.rmTempTypeFile = function(storagedir, type){
  return new Promise((resolve, reject) => {
    co((function *(){
      yield this.tempTypeFileExist(storagedir, type);
      const filepath = this.tempTypeFilePath();
      fs.unlink(filepath, function(err){
        if (err) return reject(err);
        resolve();
        console.log('removed file');
      });
    }).bind(this)).catch((err) => {
      resolve();
      console.log('removed file');
    });
  });
};
