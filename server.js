'use strict';

const port = process.env.PORT || 3000;
const baseStorageDir = process.env.STORAGE_DIR || `${__dirname}/data`;
const express = require('express');
const Storage = require('./lib/storage');
const app = express();
const appStorage = new Storage(baseStorageDir);

const userRouter = require('./route/user-router')(appStorage);
app.use('/api/user', userRouter);

const noteRouter = require('./route/note-router')(appStorage);
app.use('/api/note', noteRouter);


app.get('*', function(req, res){
  res.json('404 not found');
});

const server = app.listen(port, function(){
  console.log('server up ->', port);
});

server.isRunning = true;
module.exports = server;
