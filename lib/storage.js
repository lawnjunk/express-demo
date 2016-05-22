'use strict';

const Storage = module.exports = function(){
  this.data = {};
};

Storage.prototype.setItem = function(type, item){
  if (!this.data[type]) this.data[type] = {};
  
  if (!item || !item.id) {
    return Promise.reject(new Error('item must have id property'));
  }

  this.data[type][item.id] = item;
  return Promise.resolve(item);
};

Storage.prototype.fetchItem = function(type, id){
  var err;
  if(!this.data[type]){
    err = new Error(`Storage type: ${type} not found`);
    return Promise.reject(err);
  }

  if(!this.data[type][id]){
    err = new Error(`Storage id: ${id} for type ${type} not found`);
    return Promise.reject(err);
  }
  
  return Promise.resolve(this.data[type][id]);
};

Storage.prototype.deleteItem = function(type, id){
  var err;
  if(!this.data[type]){
    err = new Error(`Storage type: ${type} not found`);
    return Promise.reject(err);
  }

  if(!this.data[type][id]){
    err = new Error(`Storage id: ${id} for type ${type} not found`);
    return Promise.reject(err);
  }
  
  delete this.data[type][id];
  return Promise.resolve();
};

