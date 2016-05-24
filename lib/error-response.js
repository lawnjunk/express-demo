'use strict';

const AppError = require('./app-error');

module.exports = function(req, res, next){
  res.sendError = function(err){
    console.error(err.message);
    if (AppError.isAppError(err)){
      res.status(err.status).send(err.response);
      return;
    }
    res.status(500).send('internal server error');
  };
  next();
};
