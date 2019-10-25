var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'stocks';

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
                .updateOne(
                    { userEmail: req.body.email },
                    { $inc: { balance: 500 } }
                )
                .then(result => {
                    return res.status(201).json(result);
                })
                .catch(err => {
                    return res.status(422).json(err);
                });
            client.close();
        }
    );
});

module.exports = router;
