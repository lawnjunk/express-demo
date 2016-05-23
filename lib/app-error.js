'use strict';

const AppError = module.exports = function(message, status, response){
  Error.call(this, message);
  this.status = status;
  this.response = response;
};

AppError.prototype = Object.create(Error.prototype);

AppError.isAppError = function(appErr){
  return !!appErr && !!appErr.status && !!appErr.response && appErr.__proto__.send;
};

AppError.handleError = function(err, res){
  if (AppError.isAppError(err)){
    console.error(err.message);
    err.send(res);
    return;
  }
  console.error(err);
  res.status(500).send('internal server error');
};

AppError.prototype.send = function(res){
  res.status(this.status).json({message: this.response});
};
