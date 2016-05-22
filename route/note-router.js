'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const co = require('co');
const debug = require('debug')('NOTE_ROUTER');
const Note = require('../model/note');

function createNote(req, storage){
  var note;
  const authorID = req.headers.userid;
  console.log(req.headers);
  const content = req.body.content;
  try {
    note = new Note(content, authorID);
  } catch (err) {
    return Promise.reject(err);
  }
  return storage.setItem('note', note);
}

function fetchNote(req , storage){
  const id = req.params.id;
  return storage.fetchItem('note', id);
};

function deleteNote(req, storage){
  const id = req.params.id;
  return storage.deleteItem('note', id);
}

module.exports = function(storage){
  const noteRouter = Router();
  noteRouter.use(bodyParser);
  noteRouter.post('/', function(req, res){
    debug('HIT /API/NOTE POST');
    co(function* (){
      var note = yield createNote(req, storage);
      return res.status(200).json(note);
    }).catch((err) => {
      debug('ERROR /api/note POST');
      debug(err);
      res.status(400).send(err);
    });
  });

  noteRouter.get('/:id', function(req, res){
    debug('HIT /API/NOTE/:id GET');
    co(function* (){
      var note = yield fetchNote(req, storage);
      return res.status(200).json(note);
    }).catch((err) => {
      debug('ERROR /api/note/:id GET');
      debug(err);
      res.status(400).send(err);
    });
  });

  noteRouter.delete('/:id', function(req, res){
    debug('HIT /API/NOTE/:id DELETE');
    co(function* (){
      yield deleteNote(req, storage);
      return res.status(200).json({msg: 'success'});
    }).catch((err) => {
      debug('ERROR /api/note/:id GET');
      debug(err);
      res.status(400).send(err);
    });
  });

  return noteRouter;
}
