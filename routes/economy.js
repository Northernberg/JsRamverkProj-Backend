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

router.post(
    '/insert',
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
                    .updateOne(
                        { userEmail: req.body.email },
                        { $inc: { balance: 500 } }
                    )
                    .then(result => {
                        if (result.matchedCount == 0) {
                            return res.status(422).json('Email error');
                        } else {
                            return res.status(201).json(result);
                        }
                    })
                    .catch(err => {
                        return res.status(422).json(err);
                    });
                client.close();
            }
        );
    }
);

module.exports = router;
