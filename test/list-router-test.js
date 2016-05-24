'use strict';

const fs = require('fs');
const request = require('superagent');
const expect = require('chai').expect;
const server = require('../server');

const port = process.env.PORT || 3000;
const storageDir = process.env.STORAGE_DIR || `${__dirname}/data`;
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
      request.post(url)
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
      request.get(url)
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
      request.delete(url)
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
      const url =`${baseUrl}/list/${this.list.id}/note`;
      request.post(url)
      .send()
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
});
