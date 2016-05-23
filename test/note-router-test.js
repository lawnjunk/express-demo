'use strict';

const request = require('superagent');
const expect = require('chai').expect;
const server = require('../server');
const uuid = require('node-uuid');

const port = process.env.PORT || 3000;

const baseUrl = `localhost:${port}/api`;
const userId = uuid.v4();

describe('testing module note-router', function(){
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
      const testNote = {content: 'test content'};
      const url =`${baseUrl}/note`;
      request.post(url)
      .send(testNote)
      .set('UserID', userId)
      .end((err, res) => {
        this.note = res.body;
        this.res = res;
        done();
      });
    });

    it('should return a note', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.content).to.equal('test content');
    });
  });

  describe('testing get method', () => {
    before((done) => {
      const url =`${baseUrl}/note/${this.note.id}`;
      request.get(url)
      .set('UserID', userId)
      .end((err, res) => {
        this.res = res;
        done();
      });
    });

    it('should return a note', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.content).to.equal('test content');
    });
  });

  describe('testing delete method', () => {
    before((done) => {
      const url =`${baseUrl}/note/${this.note.id}`;
      request.delete(url)
      .set('UserID', userId)
      .end((err, res) => {
        this.res = res;
        done();
      });
    });

    it('should return a "success"', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.msg).to.equal('success');
    });
  });
});
