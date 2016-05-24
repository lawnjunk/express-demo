'use strict';

// environment variables
const port = process.env.PORT || 3000;
const storageDir = process.env.STORAGE_DIR = `${__dirname}/data`;

// node modules
const fs = require('fs');

// npm modules
const co = require('co');
const expect = require('chai').expect;

// app modules
const server = require('../server');
const tempData = require('./lib/temp-data');
const Storage = require('../lib/storage');

// globals && modules with dipendencies
const baseUrl = `localhost:${port}/api`;
const request = require('./lib/request')(baseUrl);
const testStorage = new Storage(storageDir);

describe('testing module list-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port, () => {
        console.log('server is running on port', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    server.close(() => {
      server.isRunning = false;
      console.log('server has terminated');
      done();
    });
  });

  describe('testing post method', () => {
    before((done) => {
      co((function* (){
        const testList = {name: 'todo'};
        const url =`${baseUrl}/list`;
        const res = yield request.post(url)
        .send(testList);
        this.res = res;
        this.list = res.body;
        done();
      }).bind(this)).catch(done);
    });

    it('should return a list', () => {
      expect(this.res.status).to.equal(200);
      expect(this.list.name).to.equal('todo');
      expect(this.list.noteIDs.length).to.equal(0);
    });
  });

  describe('testing get method', () => {
    before((done) => {
      co((function* (){
        const url =`/list/${this.list.id}`;
        const res = yield request.get(url)
        this.res = res;
        done();
      }).bind(this)).catch(done);
    });

    it('should return a list', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.name).to.equal('todo');
      expect(this.res.body.noteIDs.length).to.equal(0);
    });
  });

  describe('testing delete method', () => {
    before((done) => {
      co((function* (){
        const url =`/list/${this.list.id}`;
        const res = yield request.del(url)
        this.res = res;
        done();
      }).bind(this)).catch(done);
    });

    it('should return "success"', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.msg).to.equal('success');
    });
  });

  describe('testing /api/list/:id/note post  method', () => {
    before((done) => {
      co((function* (){
        yield tempData.mkTempTypeFile(storageDir, 'list');
        yield tempData.mkTempTypeFile(storageDir, 'note')
        const url =`/list/${tempData.templist.id}/note`;
        const res = yield request.post(url)
        .send({id: tempData.tempnote.id});
        this.result = res;
      console.log('this.result.status', this.result.status);
        done();
      }).bind(this)).catch(done);
    });

    after((done) => {
      co((function* (){
        yield tempData.rmTempTypeFile(storageDir, 'note');
        yield tempData.rmTempTypeFile(storageDir, 'list');
        done();
      }).bind(done))
    });

    it('should return "success"', () => {
      expect(this.result.status).to.equal(200);
      expect(this.result.body.id).to.equal(tempData.templist.id);
    });
  });
});
