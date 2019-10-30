process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

const dbName = 'stocks';

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const payload = { email: 'user@example.com' };
const testToken = jwt.sign(payload, secret, { expiresIn: '1h' });
const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;
const after = mocha.after;

chai.should();

chai.use(chaiHttp);
describe('Economy', () => {
    before(done => {
        chai.request(server)
            .post('/register')
            .send({
                _method: 'post',
                firstname: 'test',
                lastname: 'karlsson',
                email: 'test@testsson.se',
                password: 'test12345',
                birthdate: '1997-09-30',
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
    it('201, insert money', done => {
        chai.request(server)
            .post('/economy/insert')
            .set({
                'x-access-token': testToken,
                'Content-type': 'Application/json',
            })
            .send({
                _method: 'post',
                email: 'test@testsson.se',
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.matchedCount.should.equal(1);

                done();
            });
    });
    it('422, insert money', done => {
        chai.request(server)
            .post('/economy/insert')
            .set({
                'x-access-token': testToken,
                'Content-type': 'Application/json',
            })
            .send({
                _method: 'post',
            })
            .end((err, res) => {
                res.should.have.status(422);

                done();
            });
    });
    it('422, no token', done => {
        chai.request(server)
            .post('/economy/insert')
            .send({
                _method: 'post',
            })
            .end((err, res) => {
                res.should.have.status(401);

                done();
            });
    });
    after(done => {
        MongoClient.connect(
            url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            (err, client) => {
                const db = client.db(dbName);

                db.collection('userStocks')
                    .deleteOne({
                        userEmail: 'test@testsson.se',
                    })
                    .then(res => {
                        done();
                        client.close();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        );
    });
});
