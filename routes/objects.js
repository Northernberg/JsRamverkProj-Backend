var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'stocks';

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function(err) {
        if (err) {
            return res.status(401).json('Invalid JWT token.');
        }
        res.body = jwt.verify(token, process.env.JWT_SECRET);
        next();
    });
}

router.get(
    '/',
    (req, res, next) => checkToken(req, res, next),
    (req, res) => {
        MongoClient.connect(
            url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            (err, client) => {
                const db = client.db(dbName);

                db.collection('objects')
                    .find({})
                    .project({})
                    .sort({ id: -1 })
                    .limit(20)
                    .toArray((err, result) => {
                        if (err) {
                            return res.status(404).json(err.message);
                        } else {
                            return res.status(200).json(result);
                        }
                    });
                client.close();
            }
        );
    }
);

router.post(
    '/find',
    (req, res, next) => checkToken(req, res, next),
    (req, res) => {
        MongoClient.connect(
            url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            (err, client) => {
                const db = client.db(dbName);

                db.collection('objects')
                    .find({ name: req.body.name })
                    .project({})
                    .limit(1)
                    .toArray((err, result) => {
                        if (err || result === null) {
                            return res.status(404).json(err.message);
                        } else {
                            return res.status(200).json(result);
                        }
                    });
                client.close();
            }
        );
    }
);

router.get(
    '/:userEmail',
    (req, res, next) => checkToken(req, res, next),
    (req, res) => {
        MongoClient.connect(
            url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            (err, client) => {
                const db = client.db(dbName);

                db.collection('userStocks')
                    .find({ userEmail: req.params.userEmail })
                    .project({ stocks: 1, balance: 1 })
                    .limit(1)
                    .toArray((err, result) => {
                        if (err || result === null) {
                            return res.status(404).json(err);
                        } else {
                            return res.status(200).json(result);
                        }
                    });
                client.close();
            }
        );
    }
);

router.post(
    '/sell',
    (req, res, next) => checkToken(req, res, next),
    (req, res) => {
        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(client => {
                const db = client.db(dbName);

                db.collection('userStocks').findOne(
                    {
                        userEmail: req.body.email,
                        'stocks.name': req.body.name,
                        'stocks.qty': { $gte: req.body.amount },
                    },
                    async (err, result) => {
                        if (err || result === null) {
                            return res
                                .status(422)
                                .json('Your stock does not exist');
                        }
                        if (result.qty > 0 && result.qty >= req.body.amount) {
                            res.status(422).json('Not enough stocks');
                            return;
                        }
                        db.collection('userStocks').updateOne(
                            {
                                userEmail: req.body.email,
                                'stocks.name': req.body.name,
                            },
                            {
                                $inc: {
                                    'stocks.$.qty': -parseInt(req.body.amount),
                                    balance: parseInt(req.body.totalPrice),
                                },
                            },
                            err => {
                                if (err) {
                                    return res.status(422).json(err);
                                }
                            }
                        );
                        db.collection('objects').findOneAndUpdate(
                            {
                                name: req.body.name,
                            },
                            {
                                $inc: { qty: parseInt(req.body.amount) }, // Increment negativt och lägga till ökning/minskning av värde
                                $set: {
                                    price: +(
                                        req.body.price * 1 +
                                        1 * -parseInt(req.body.amount)
                                    ).toFixed(2),
                                },
                                $push: {
                                    history: {
                                        value: +(
                                            req.body.price * 1 +
                                            1 * -parseInt(req.body.amount)
                                        ).toFixed(2),
                                        time: req.body.time,
                                    },
                                },
                            },
                            {
                                returnOriginal: false,
                            },
                            (err, result) => {
                                if (err) {
                                    return res.status(422).json(err);
                                } else {
                                    return res.status(200).json(result);
                                }
                            }
                        );
                        client.close();
                    }
                );
            })
            .catch(err => {
                return res.status(422).json(err);
            });
    }
);

router.post(
    '/buy',
    (req, res, next) => checkToken(req, res, next),
    (req, res) => {
        MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(client => {
                const db = client.db(dbName);
                let balance = 0;

                db.collection('userStocks').findOne(
                    { userEmail: res.body.email },
                    async (err, result) => {
                        if (err) {
                            return res.status(422).json('Cannot find user');
                        }
                        if (result.balance < req.body.totalPrice) {
                            res.status(422).json('Insufficient balance');
                            return;
                        }
                        await db.collection('userStocks').updateOne(
                            {
                                userEmail: res.body.email,
                                'stocks.name': req.body.name,
                            },
                            {
                                $inc: {
                                    'stocks.$.qty': parseInt(req.body.amount),
                                    balance: -parseInt(req.body.totalPrice),
                                },
                            },
                            (err, user) => {
                                if (err) {
                                    return res.status(422).json(err.message);
                                }
                                balance = user.balance;
                            }
                        );
                        await db.collection('objects').findOneAndUpdate(
                            {
                                name: req.body.name,
                            },
                            {
                                $inc: { qty: -parseInt(req.body.amount) }, // Increment negativt och lägga till ökning/minskning av värde
                                $set: {
                                    price: +(
                                        req.body.price * 1 +
                                        1 * parseInt(req.body.amount)
                                    ).toFixed(2),
                                },
                                $push: {
                                    history: {
                                        value: +(
                                            req.body.price * 1 +
                                            1 * parseInt(req.body.amount)
                                        ).toFixed(2),
                                        time: req.body.time,
                                    },
                                },
                            },
                            {
                                returnOriginal: false,
                            },
                            (err, result) => {
                                if (err) {
                                    return res.status(422).json(err);
                                } else {
                                    result.balance = balance;
                                    return res.status(200).json(result);
                                }
                            }
                        );
                        client.close();
                    }
                );
            })
            .catch(err => {
                return res.status(422).json(err);
            });
    }
);

module.exports = router;
