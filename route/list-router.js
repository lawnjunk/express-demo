'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const co = require('co');
const debug = require('debug')('LIST_ROUTER');
const AppError = require('../lib/app-error');

const List = require('../model/list');

function saveList(list, storage){
  return storage.setItem('list', list);
}

function createList(reqBody, storage){
  var list;
  try {
    list = new List(reqBody.name);
  } catch (err) {
    return Promise.reject(err);
  }
  return saveList(list, storage);
}


function fetchList(id, storage){
  return storage.fetchItem('list', id);
}

function deleteList(id, storage){
  return storage.deleteItem('list', id);
}

function assertNoteExists(reqBody){
  return new Promise((resolve, reject) => {
    if (!reqBody.id){
      return reject(AppError.error400('did not povide note id'));
    }
    storage.fetchItem('note', reqBody.id).then(() => {
      resolve(reqBody.id);
    }).catch((err) => {
      reject(err);
    });;
  });
}

module.exports = function(storage){
  const listRouter = Router();
  listRouter.use(bodyParser);
  listRouter.post('/', function(req, res){
    debug('HIT /API/LIST POST');
    co(function* (){
      var list = yield createList(req.body, storage);
      return res.status(200).json(list);
    }).catch((err) => {
      console.log(err);
      debug('ERROR /api/list POST');
      debug(err);
      res.sendError(err);
    });
  });

  listRouter.get('/:id', function(req, res){
    debug('HIT /API/LIST/:id GET');
    co(function* (){
      var list = yield fetchList(req.params.id, storage);
      return res.status(200).json(list);
    }).catch((err) => {
      debug('ERROR /api/list/:id GET');
      debug(err);
      res.sendError(err);
    });
  });

  listRouter.delete('/:id', function(req, res){
    debug('HIT /API/LIST/:id DELETE');
    co(function* (){
      yield deleteList(req.params.id, storage);
      return res.status(200).json({msg: 'success'});
    }).catch((err) => {
      debug('ERROR /api/list/:id GET');
      debug(err);
      res.sendError(err);
    });
  });

  listRouter.post('/:id/note', function(req, res){
    debug('HIT /API/LIST POST');
    co(function* (){
      let id = yield assertNoteExists(req.body)
      let list = yield fetchList(req.body, storage);
      list.addNoteID(id);
      list = yield saveList(list, storage);
      return res.status(200).json(list);
    }).catch((err) => {
      console.log(err);
      debug('ERROR /api/list POST');
      debug(err);
      res.sendError(err);
    });
  });

  return listRouter;
};
