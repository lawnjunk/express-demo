'use strict';

const expect = require('chai').expect;

const Storage = require('../lib/storage');
const testStorage = new Storage();

describe('testing module storage', function(){
  describe('testing method fetchItem', function(){
    before((done) => {
      testStorage.data.note = {};
      testStorage.data.note['123'] = {id: 123, content: 'test data'};
      testStorage.fetchItem('note', 123).then((item) => {
        this.result = item;
        done();
      }).catch((err) => {
        this.result = err;
        done()
      });
    });

    it('should return a note', (done) => {
      expect(this.result.id).to.equal(123);
      expect(this.result.content).to.equal('test data');
      done();
    });
  });

  describe('testing method setItem', function(){
    before((done) => {
      testStorage.setItem('note', {id:321, content: 'test content'})
      .then((item) => {
        this.result = item;
        done();
      })
      .catch((err) => {
        this.result = err;
        done();
      });
    });

    it('should return a note', (done) => {
      expect(this.result.id).to.equal(321);
      expect(this.result.content).to.equal('test content');
      done();
    });
  });

  describe('testing method deleteItem', function(){
    before((done) => {
      testStorage.deleteItem('note', 321)
      .then((item) => {
        this.result = testStorage.data.note[321];
        done();
      })
      .catch((err) => {
        this.result = err;
        done();
      });
    });

    it('should return a note', (done) => {
      expect(this.result).to.equal(undefined);
      done();
    });
  });

});

