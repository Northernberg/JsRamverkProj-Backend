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

describe('Objects', () => {
    before(done => {
        chai.request(server)
            .post('/register')
            .send({
                _method: 'post',
                firstname: 'test',
                lastname: 'karlsson',
                email: 'object@test.com',
                password: 'test12345',
                birthdate: '1997-09-30',
            })
            .end((err, res) => {
                res.should.have.status(201);
                MongoClient.connect(
                    url,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    },
                    (err, client) => {
                        const db = client.db(dbName);

                        db.collection('objects')
                            .insertOne({
                                name: 'Peasoup',
                                qty: 10,
                                price: 55,
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
    it('200, Get all objects', done => {
        chai.request(server)
            .get('/objects')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    it('200 Find one object', done => {
        chai.request(server)
            .post('/objects/find')
            .send({
                _method: 'post',
                name: 'Peasoup',
            })
            .end((err, res) => {
                res.should.have.status(200);

                done();
            });
    });
    it('200 Get user objects', done => {
        chai.request(server)
            .get('/objects/object@test.com')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('200 Buy object', done => {
        chai.request(server)
            .post('/objects/buy')
            .send({
                _method: 'post',
                name: 'Peasoup',
                email: 'object@test.com',
                amount: 1,
                totalPrice: 100,
                price: 100,
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('200 Sell object', done => {
        chai.request(server)
            .post('/objects/sell')
            .send({
                _method: 'post',
                name: 'Peasoup',
                email: 'object@test.com',
                amount: 1,
                totalPrice: 100,
                price: 100,
            })
            .end((err, res) => {
                res.should.have.status(200);
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
                        userEmail: 'object@test.com',
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
