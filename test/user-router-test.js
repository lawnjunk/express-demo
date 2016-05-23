'use strict';

const request = require('superagent');
const expect = require('chai').expect;
const server = require('../server');

const port = process.env.PORT || 3000;
process.env.STORAGE_DIR || `${__dirname}/data`;
const baseUrl = `localhost:${port}/api`;

describe('testing module user-router', function(){
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
      const testUser = {username: 'slugneo', email: 'slug@slug.com'};
      const url =`${baseUrl}/user`;
      request.post(url)
      .send(testUser)
      .end((err, res) => {
        this.user = res.body;
        this.res = res;
        done();
      });
    });

    it('should return a user', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.username).to.equal('slugneo');
      expect(this.res.body.email).to.equal('slug@slug.com');
    });
  });

  describe('testing get method', () => {
    before((done) => {
      const url =`${baseUrl}/user/${this.user.id}`;
      request.get(url)
      .end((err, res) => {
        this.res = res;
        done();
      });
    });

    it('should return a user', () => {
      expect(this.res.status).to.equal(200);
      expect(this.res.body.username).to.equal('slugneo');
      expect(this.res.body.email).to.equal('slug@slug.com');
    });
  });

  describe('testing delete method', () => {
    before((done) => {
      const url =`${baseUrl}/user/${this.user.id}`;
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
});
