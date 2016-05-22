'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const co = require('co');
const debug = require('debug')('USER_ROUTER');

const User = require('../model/user');

function createUser(reqBody, storage){
  var user;
  try {
    user = new User(reqBody.username, reqBody.email);
  } catch (err) {
    return Promise.reject(err);
  }
  return storage.setItem('user', user);
}

function fetchUser(id, storage){
  return storage.fetchItem('user', id);
};

function deleteUser(id, storage){
  return storage.deleteItem('user', id);
}

module.exports = function(storage){
  const noteRouter = Router();
  noteRouter.use(bodyParser);
  noteRouter.post('/', function(req, res){
    debug('HIT /API/USER POST');
    co(function* (){
      var user = yield createUser(req.body, storage);
      return res.status(200).json(user);
    }).catch((err) => {
      debug('ERROR /api/user POST');
      debug(err);
      res.status(400).send(err);
    });
  });

  noteRouter.get('/:id', function(req, res){
    debug('HIT /API/USER/:id GET');
    co(function* (){
      var user = yield fetchUser(req.params.id, storage);
      return res.status(200).json(user);
    }).catch((err) => {
      debug('ERROR /api/user/:id GET');
      debug(err);
      res.status(400).send(err);
    });
  });

  noteRouter.delete('/:id', function(req, res){
    debug('HIT /API/USER/:id DELETE');
    co(function* (){
      yield deleteUser(req.params.id, storage);
      return res.status(200).json({msg: 'success'});
    }).catch((err) => {
      debug('ERROR /api/user/:id GET');
      debug(err);
      res.status(400).send(err);
    });
  });

  return noteRouter;
}
