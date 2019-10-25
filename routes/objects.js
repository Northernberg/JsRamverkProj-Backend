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
        next();
    });
}

router.get('/', (req, res) => {
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
});

router.post('/find', (req, res) => {
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
                    if (err) {
                        return res.status(404).json(err.message);
                    } else {
                        return res.status(200).json(result);
                    }
                });
            client.close();
        }
    );
});

router.get('/:userEmail', (req, res) => {
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
                    if (err) {
                        return res.status(404).json(err);
                    } else {
                        return res.status(200).json(result);
                    }
                });
            client.close();
        }
    );
});

router.post('/insert', (req, res) => {
    MongoClient.connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err, client) => {
            const db = client.db(dbName);

            db.collection('userStocks')
                .insertOne(req.body.message)
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
});

router.post('/sell', (req, res) => {
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
                (err, result) => {
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
                    db.collection('objects').updateOne(
                        {
                            name: req.body.name,
                        },
                        {
                            $inc: { qty: parseInt(req.body.amount) }, // Increment negativt och lägga till ökning/minskning av värde
                            $mul: {
                                price: 1 + 0.05 * -parseInt(req.body.amount),
                            },
                            $push: {
                                history: {
                                    value: req.body.price,
                                    time: new Date()
                                        .toLocaleTimeString()
                                        .slice(0, -3),
                                },
                            },
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
});

router.post('/buy', (req, res) => {
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(client => {
            const db = client.db(dbName);

            db.collection('userStocks').findOne(
                { userEmail: req.body.email },
                (err, result) => {
                    if (err) {
                        return res.status(422).json('Cannot find user');
                    }
                    if (result.balance < req.body.totalPrice) {
                        res.status(422).json('Insufficient balance');
                        return;
                    }
                    db.collection('userStocks').updateOne(
                        {
                            userEmail: req.body.email,
                            'stocks.name': req.body.name,
                        },
                        {
                            $inc: {
                                'stocks.$.qty': parseInt(req.body.amount),
                                balance: -parseInt(req.body.totalPrice),
                            },
                            $mul: {
                                'stocks.$.price':
                                    1 + 0.05 * -parseInt(req.body.amount),
                            },
                        },
                        err => {
                            if (err) {
                                return res.status(422).json(err.message);
                            }
                        }
                    );
                    db.collection('objects').updateOne(
                        {
                            name: req.body.name,
                        },
                        {
                            $inc: { qty: -parseInt(req.body.amount) }, // Increment negativt och lägga till ökning/minskning av värde
                            $mul: {
                                price: 1 + 0.05 * parseInt(req.body.amount),
                            },
                            $push: {
                                history: {
                                    value: req.body.price,
                                    time: new Date()
                                        .toLocaleTimeString()
                                        .slice(0, -3),
                                },
                            },
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
});

module.exports = router;
