'use strict';

// environment variables
const port = process.env.PORT || 3000;
const storageDir = process.env.STORAGE_DIR || `${__dirname}/data`;

// node modules
const fs = require('fs');

// npm modules
const co = require('co');
const sa = require('superagent');
const expect = require('chai').expect;

// app modules
const sp = require('../lib/superpromise');
const server = require('../server');
const tempData = require('./lib/temp-data');

// globals
const baseUrl = `localhost:${port}/api`;

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
      const testList = {name: 'todo'};
      const url =`${baseUrl}/list`;
      sa.post(url)
      .send(testList)
      .end((err, res) => {
        this.list = res.body
        console.log(this.list);
        this.res = res;
        done();
      });
    });

    it('should return a list', () => {
      expect(this.res.status).to.equal(200);
      expect(this.list.name).to.equal('todo');
      expect(this.list.noteIDs.length).to.equal(0);
    });
  });

  describe('testing get method', () => {
    before((done) => {
      const url =`${baseUrl}/list/${this.list.id}`;
      sa.get(url)
      .end((err, res) => {
        this.res = res;
        done();
      });
    });

    it('should return a list', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.name).to.equal('todo');
      expect(this.res.body.noteIDs.length).to.equal(0);
    });
  });

  describe('testing delete method', () => {
    before((done) => {
      const url =`${baseUrl}/list/${this.list.id}`;
      sa.delete(url)
      .end((err, res) => {
        this.res = res;
        done();
      });
    });

    it('should return "success"', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.msg).to.equal('success');
    });
  });

  describe('testing /api/list/:id/note post  method', () => {
    before((done) => {
      co((function* (){
        yield tempData.mkTempTypeFile(storageDir, 'note')
        const url =`${baseUrl}/list/${this.list.id}/note`;
        const request = sa.post(url)
        .send({id: tempData.tempnote.id});
        const res = yield sp(request);
        this.result = res;
        done();
      }).bind(this)).catch((err) => {
        this.result = err;
        done();
      });
    });

    after((done) => {
      co((function* (){
        yield tempData.rmTempTypeFile(storageDir, 'note');
      }).bind(this))
    });

    it('should return "success"', () => {
      expect(this.result.status).to.equal(200);
      expect(this.result.body.msg).to.equal('success');
    });
  });
});
