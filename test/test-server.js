const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../app/express/express.js');
const knex = server.knex;

describe('POST /auth/login', () => {
  it('should login a user', (done) => {
    chai.request(server)
    .post('/login')
    .send({
      username: 'admin',
      password: 'admin'
    })
    .end((err, res) => {
      res.redirects.length.should.eql(0);
      res.status.should.eql(200);
      res.type.should.eql('application/json');
      res.body.status.should.eql('success');
      done();
    });
  });
});
